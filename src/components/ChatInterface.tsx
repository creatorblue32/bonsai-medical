'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AI_MODELS = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
  { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', provider: 'xAI' },
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI' },
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', provider: 'Google' },
  { id: 'openai/gpt-oss-120b', name: 'GPT-OSS-120B', provider: 'OpenAI' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
  { id: 'qwen/qwen3-235b-a22b-instruct-2507', name: 'Qwen3 235B Instruct', provider: 'Qwen' },
];

interface QuestionContext {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  questionContext?: QuestionContext;
  chatId?: string;
}

export default function ChatInterface({ 
  questionContext,
  chatId,
}: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when chatId changes
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [chatId]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Build context prompt
    let fullPrompt = '';
    if (questionContext) {
      fullPrompt = `You are a helpful tutor helping a student study for the MCAT. The student just answered a question incorrectly and needs help.

Context:
- Question: ${questionContext.question}
- Student's answer: ${questionContext.userAnswer}
- Correct answer: ${questionContext.correctAnswer}
- Explanation: ${questionContext.explanation}

Student's question: ${userMessage}

IMPORTANT: Be VERY concise. Keep your response to 2-3 sentences maximum. Provide a clear, encouraging, and educational response.`;
    } else {
      fullPrompt = userMessage;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: selectedModel.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          
          // Update the assistant message
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMsg.id 
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const presetQuestions = [
    "How can I remember this?",
    "Explain this concept differently",
  ];

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <span>Ask AI</span>
        
        {/* Model Selector */}
        <div className="model-selector" ref={dropdownRef}>
          <button 
            type="button"
            className="model-selector-trigger"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          >
            <span className="model-name">{selectedModel.name}</span>
            <ChevronDown size={14} className={`model-chevron ${isModelDropdownOpen ? 'open' : ''}`} />
          </button>
          
          {isModelDropdownOpen && (
            <div className="model-dropdown">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  className={`model-option ${selectedModel.id === model.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedModel(model);
                    setIsModelDropdownOpen(false);
                  }}
                >
                  <span className="model-option-name">{model.name}</span>
                  <span className="model-option-provider">{model.provider}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {messages.length === 0 && (
        <div className="chat-presets">
          {presetQuestions.map((q, i) => (
            <button 
              key={i} 
              className="chat-preset-button"
              onClick={() => sendMessage(q)}
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-message ${msg.role}`}
            >
              <div className="chat-message-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({node, inline, className, children, ...props}: any) => {
                      return inline ? (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      ) : (
                        <pre>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this problem..."
            className="chat-input"
            rows={1}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="chat-send-button"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
}
