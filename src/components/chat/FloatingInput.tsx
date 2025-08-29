import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStorage } from '@/hooks/useChatStorage';

interface FloatingInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  centered?: boolean;
}

const FloatingInput = ({ onSendMessage, disabled = false, centered = false }: FloatingInputProps) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, getCurrentSession, createSession } = useChatStorage();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || disabled) return;

    const currentSession = getCurrentSession();
    if (!currentSession) {
      createSession();
    }

    addMessage({
      content: message.trim(),
      role: 'user',
    });

    onSendMessage?.(message.trim());
    setMessage('');
  };



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log('File upload clicked');
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    console.log('Image upload clicked');
  };

  const handlePromptSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || disabled) return;

    const currentSession = getCurrentSession();
    if (!currentSession) {
      createSession();
    }

    addMessage({
      content: message.trim(),
      role: 'user',
    });

    onSendMessage?.(message.trim());
    setMessage('');
  };

  if (centered) {
    return (
      <div className="w-full">
        <div className="bg-scraper-bg-card/98 backdrop-blur-xl border border-scraper-border/60 rounded-3xl shadow-2xl hover:shadow-scraper-glow transition-all duration-500 hover:border-scraper-accent-primary/50 hover:bg-scraper-bg-card/100 ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01]">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3 p-4">
            {/* File Attachment Buttons */}
            <div className="flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-9 w-9 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-hover/80 transition-all duration-200 rounded-xl hover:scale-105"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImageUpload}
                className="h-9 w-9 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-hover/80 transition-all duration-200 rounded-xl hover:scale-105"
                disabled={disabled}
              >
                <Image className="w-4 h-4" />
              </Button>
            </div>

            {/* Message Input */}
            <div className="flex-1 max-h-32 overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder="Message WebScraper AI..."
                disabled={disabled}
                className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent text-scraper-text-primary placeholder:text-scraper-text-muted focus:ring-0 focus:outline-none scrollbar-thin scrollbar-thumb-scraper-border scrollbar-track-transparent text-base"
                rows={1}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="h-10 w-10 p-0 bg-scraper-gradient-primary hover:bg-scraper-gradient-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-scraper-lg hover:shadow-scraper-xl transition-all duration-200 touch-manipulation rounded-xl hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 text-scraper-text-primary" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 p-2 sm:p-3 z-50 bg-gradient-to-t from-scraper-bg-primary via-scraper-bg-primary/98 to-transparent backdrop-blur-xl" style={{ left: 'var(--sidebar-width, 320px)', right: 'var(--sources-width, 0px)' }}>
      <div className="max-w-3xl mx-auto px-2 sm:px-0">
        {/* Input Container */}
        <div className="bg-scraper-bg-card/98 backdrop-blur-xl border border-scraper-border/60 rounded-3xl shadow-2xl hover:shadow-scraper-glow transition-all duration-500 hover:border-scraper-accent-primary/50 hover:bg-scraper-bg-card/100 ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01]">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3 p-2 sm:p-3">
            {/* File Attachment Buttons */}
            <div className="hidden sm:flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-8 w-8 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-hover/90 transition-all duration-300 rounded-xl hover:scale-110 active:scale-95"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImageUpload}
                className="h-8 w-8 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-hover/90 transition-all duration-300 rounded-xl hover:scale-110 active:scale-95"
                disabled={disabled}
              >
                <Image className="w-4 h-4" />
              </Button>
            </div>

            {/* Message Input */}
            <div className="flex-1 max-h-32 overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder="Message WebScraper AI..."
                disabled={disabled}
                className="min-h-[40px] max-h-32 resize-none border-0 bg-transparent text-scraper-text-primary placeholder:text-scraper-text-muted focus:ring-0 focus:outline-none scrollbar-thin scrollbar-thumb-scraper-border scrollbar-track-transparent text-sm sm:text-base"
                rows={1}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 bg-scraper-gradient-primary hover:bg-scraper-gradient-primary/95 disabled:opacity-40 disabled:cursor-not-allowed shadow-scraper-xl hover:shadow-scraper-glow transition-all duration-300 touch-manipulation rounded-2xl hover:scale-110 active:scale-95 ring-2 ring-scraper-accent-primary/20 hover:ring-scraper-accent-primary/40"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4 text-scraper-text-primary" />
            </Button>
          </form>
        </div>

        {/* Usage Note */}
        {/* <p className="text-center text-scraper-text-muted text-xs mt-3">
          WebScraper AI can make mistakes. Verify important information from sources.
        </p> */}
      </div>
    </div>
  );
};

export default FloatingInput;