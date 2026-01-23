'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BonsaiIcon from './BonsaiIcon';
import ThemeToggle from './ThemeToggle';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Brain,
  Clock,
  CheckCircle2,
  ChevronDown,
  Repeat,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "What exams does Bonsai support?",
      answer: "Bonsai specializes in USMLE Step 1, USMLE Step 2 CK, and MCAT preparation. Our AI coach creates personalized study plans tailored to each exam's unique format and content requirements."
    },
    {
      question: "How does the personalized study plan work?",
      answer: "You input your target score, test date, and available study resources. Bonsai's AI analyzes this information and creates a customized day-by-day schedule that tells you exactly what to study and when, optimized to help you reach your goal score."
    },
    {
      question: "Can I integrate my existing study materials?",
      answer: "Yes! Bonsai works with your existing resources like UWorld, FirstAid, Pathoma, Sketchy, Anki decks, and more. We create a unified study plan that coordinates all your materials instead of replacing them."
    },
    {
      question: "How far in advance should I start using Bonsai?",
      answer: "We recommend starting at least 3-6 months before your exam date for optimal results. However, Bonsai adapts to your timeline—whether you have 2 months or 12 months, we'll create a plan that maximizes your study time."
    }
  ];

  return (
    <div className="landing-page">
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          {/* Left side - Text */}
          <div className="landing-hero-text">
            <div className="landing-logo">
              <BonsaiIcon size={52} className="landing-logo-icon" />
              <h1 className="landing-logo-text">bonsai</h1>
            </div>
            
            <p className="landing-tagline">
              Your AI coach for medical exam success. 
              Get a personalized study plan to reach your target score.
            </p>

            <div className="landing-features-list">
              <div className="landing-feature-row">
                <CheckCircle2 size={16} />
                <span>AI-powered study coach & personalized plan</span>
              </div>
              <div className="landing-feature-row">
                <CheckCircle2 size={16} />
                <span>USMLE Step 1 & 2, MCAT prep</span>
              </div>
              <div className="landing-feature-row">
                <CheckCircle2 size={16} />
                <span>Input your goals, get your exact roadmap</span>
              </div>
            </div>

            <button 
              className="landing-scroll-btn"
              onClick={() => scrollToSection('features')}
            >
              Learn more
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Right side - Auth Card */}
          <div className="landing-auth-card">
            <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="landing-auth-subtitle">
              {isSignUp ? 'Start your personalized study plan' : 'Continue your study sessions'}
            </p>

            {error && <div className="landing-error">{error}</div>}

            <form onSubmit={handleSubmit} className="landing-auth-form">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="landing-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="landing-input"
                minLength={6}
              />
              <button type="submit" className="landing-btn-primary" disabled={loading}>
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="landing-divider">
              <span>or</span>
            </div>

            <button onClick={handleGoogleSignIn} className="landing-btn-google" disabled={loading}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="landing-auth-toggle">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-label">Features</span>
            <h2 className="landing-section-title">Why Bonsai?</h2>
          </div>

          <div className="landing-features-grid">
            <div className="landing-card">
              <div className="landing-card-icon">
                <Brain size={24} strokeWidth={1.5} />
              </div>
              <h3>AI Study Coach</h3>
              <p>
                Your personal AI coach analyzes your goal score, test date, and available resources to create a customized study plan that adapts to your progress.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-card-icon">
                <Calendar size={24} strokeWidth={1.5} />
              </div>
              <h3>Personalized Roadmap</h3>
              <p>
                Input your target score, exam date, and study materials. Get an exact day-by-day plan that tells you what to study and when to maximize your results.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-card-icon">
                <BarChart3 size={24} strokeWidth={1.5} />
              </div>
              <h3>Goal-Oriented Tracking</h3>
              <p>
                Track your progress toward your target score. See exactly where you stand and what you need to work on to reach your goal.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-card-icon">
                <BookOpen size={24} strokeWidth={1.5} />
              </div>
              <h3>Multi-Exam Support</h3>
              <p>
                Comprehensive prep for USMLE Step 1, USMLE Step 2 CK, and MCAT. All content areas covered with high-yield practice questions.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-card-icon">
                <Repeat size={24} strokeWidth={1.5} />
              </div>
              <h3>Adaptive Learning</h3>
              <p>
                Spaced repetition algorithm adapts to your performance, ensuring you review material at the optimal time for maximum retention.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-card-icon">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <h3>Resource Integration</h3>
              <p>
                Integrate your existing study materials—UWorld, Anki, FirstAid, and more. Bonsai creates a unified plan across all your resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-label">Proven Methods</span>
            <h2 className="landing-section-title">Science-Backed Study Strategies</h2>
          </div>

          <div className="landing-science-card">
            <div className="landing-science-content">
              <div className="landing-science-point">
                <div className="landing-science-number">1</div>
                <div>
                  <h4>The Spacing Effect</h4>
                  <p>Information reviewed at increasing intervals is retained far longer than information crammed in a single session. This is one of the most robust findings in cognitive psychology.</p>
                </div>
              </div>

              <div className="landing-science-point">
                <div className="landing-science-number">2</div>
                <div>
                  <h4>Desirable Difficulty</h4>
                  <p>Retrieving information when it's slightly difficult—just before you forget—creates stronger memories than easy reviews. Bonsai times your reviews to hit this sweet spot.</p>
                </div>
              </div>

              <div className="landing-science-point">
                <div className="landing-science-number">3</div>
                <div>
                  <h4>Neural Consolidation</h4>
                  <p>Each review strengthens the neural pathways associated with that memory. Spaced reviews trigger reconsolidation at optimal moments, building robust long-term memory.</p>
                </div>
              </div>
            </div>

            <div className="landing-science-visual">
              <div className="landing-retention-demo">
                <div className="retention-label">Memory Retention</div>
                <div className="retention-bars">
                  <div className="retention-bar-group">
                    <div className="retention-bar" style={{ height: '30%' }} />
                    <span>Cramming</span>
                  </div>
                  <div className="retention-bar-group">
                    <div className="retention-bar active" style={{ height: '85%' }} />
                    <span>Spaced</span>
                  </div>
                </div>
                <div className="retention-caption">After 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Setup Section */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-label">Your Path to Success</span>
            <h2 className="landing-section-title">Three Steps to Your Target Score</h2>
          </div>

          <div className="landing-content-grid">
            <div className="landing-content-card">
              <div className="landing-science-number" style={{ marginBottom: '1rem' }}>1</div>
              <h3>Set Your Goals</h3>
              <p>Enter your target exam (USMLE Step 1/2 or MCAT), your goal score, and your test date. Bonsai understands what it takes to reach your target.</p>
            </div>

            <div className="landing-content-card">
              <div className="landing-science-number" style={{ marginBottom: '1rem' }}>2</div>
              <h3>Add Your Resources</h3>
              <p>Tell us what study materials you have—UWorld, FirstAid, Pathoma, Sketchy, Anki decks, and more. We'll integrate everything into one cohesive plan.</p>
            </div>

            <div className="landing-content-card">
              <div className="landing-science-number" style={{ marginBottom: '1rem' }}>3</div>
              <h3>Follow Your Plan</h3>
              <p>Get your personalized day-by-day study schedule. Know exactly what to study each day, track your progress, and adjust as needed to hit your goal score.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-label">FAQ</span>
            <h2 className="landing-section-title">Common Questions</h2>
          </div>

          <div className="landing-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`landing-faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button 
                  className="landing-faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className="landing-faq-chevron" />
                </button>
                <div className="landing-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-cta-card">
            <BonsaiIcon size={48} className="landing-cta-icon" />
            <h2>Ready to begin?</h2>
            <p>Start building knowledge that lasts.</p>
            <button 
              className="landing-cta-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <BonsaiIcon size={20} />
            <span>bonsai</span>
          </div>
          <p>Your AI coach for medical exam success.</p>
        </div>
      </footer>
    </div>
  );
}
