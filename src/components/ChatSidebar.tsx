'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Question, AnswerResult } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface InlineChatProps {
  question: Question | null;
  lastAnswer: AnswerResult | null;
}

export default function InlineChat({ question, lastAnswer }: InlineChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Start expanded
  const [hasInitialized, setHasInitialized] = useState(false);
  const questionId = question?.id;
  
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const userAnswerText = question && lastAnswer 
    ? (lastAnswer.skipped ? 'Skipped' : question.options[lastAnswer.selectedIndex])
    : '';
  const correctAnswerText = question ? question.options[question.correctIndex] : '';

  const sendMessage = useCallback(async (content: string, currentMessages: Message[]) => {
    if (!question) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };
    
    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          question: question.question,
          explanation: question.explanation,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;
      
      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          // Parse SSE data
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text chunk - remove the "0:" prefix and parse the JSON string
              try {
                const textContent = JSON.parse(line.slice(2));
                assistantContent += textContent;
                setMessages(prev => 
                  prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
                );
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [question, userAnswerText, correctAnswerText]);

  // Reset and send initial message when chat opens with new question
  useEffect(() => {
    if (isOpen && question && !hasInitialized) {
      setHasInitialized(true);
      setMessages([]);
      
      // Send initial help request
      sendMessage('Can you help me understand why my answer was wrong and explain the correct answer?', []);
    }
    
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen, question, hasInitialized, questionId, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(input.trim(), messages);
    setInput('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isLoading]);

  if (!question || !lastAnswer) return null;

  return (
    <div className={`inline-chat ${isOpen ? 'expanded' : 'collapsed'}`}>
      {/* Header - Always visible, clickable to expand/collapse */}
      <button className="inline-chat-header" onClick={toggleOpen}>
        <div className="inline-chat-title">
          <Sparkles size={16} />
          <span>Ask AI Tutor</span>
        </div>
        <div className="inline-chat-toggle">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="inline-chat-content">
          {/* Messages */}
          <div className="inline-chat-messages">
            {messages.length === 0 && isLoading && (
              <div className="inline-chat-empty">
                <Loader2 size={18} className="spin" />
                <span>Starting conversation...</span>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`inline-chat-message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                {message.role === 'assistant' && (
                  <div className="inline-message-avatar">
                    <Sparkles size={12} />
                  </div>
                )}
                <div className="inline-message-content">
                  {message.content || (isLoading && message.role === 'assistant' ? <Loader2 size={14} className="spin" /> : null)}
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="inline-chat-input-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="inline-chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="inline-chat-send"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

