import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStorage } from '@/hooks/useChatStorage';

interface FloatingInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
}

const FloatingInput = ({ onSendMessage, disabled = false }: FloatingInputProps) => {
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

  return (
    <div className="relative bottom-0 left-0 right-0 p-4 z-30">
      <div className="max-w-4xl mx-auto">
        {/* Input Container */}
        <div className="bg-scraper-bg-card border border-scraper-border rounded-2xl shadow-scraper-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3 p-4">
            {/* File Attachment Buttons */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-8 w-8 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card-hover"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImageUpload}
                className="h-8 w-8 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card-hover"
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
                className="min-h-[20px] max-h-32 resize-none border-0 bg-transparent text-scraper-text-primary placeholder:text-scraper-text-muted focus:ring-0 focus:outline-none scrollbar-thin scrollbar-thumb-scraper-border scrollbar-track-transparent"
                rows={1}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="h-8 w-8 p-0 bg-scraper-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-scraper-sm"
            >
              <Send className="w-4 h-4 text-scraper-text-primary" />
            </Button>
          </form>
        </div>

        {/* Usage Note */}
        <p className="text-center text-scraper-text-muted text-xs mt-3">
          WebScraper AI can make mistakes. Verify important information from sources.
        </p>
      </div>
    </div>
  );
};

export default FloatingInput;