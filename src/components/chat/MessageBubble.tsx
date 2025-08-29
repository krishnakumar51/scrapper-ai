import { Bot, User, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat';
import SourcesList from './SourcesList';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-4 p-4 group ${
      isUser 
        ? 'bg-transparent justify-end' 
        : 'bg-scraper-bg-card/30 justify-start'
    }`}>
      {isUser ? (
        // User message layout (right-aligned)
        <>
          {/* Content */}
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center justify-end gap-2">
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyMessage}
                  className="h-6 w-6 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
            </div>

            {/* Message Content */}
            <div className="bg-scraper-gradient-primary rounded-2xl rounded-tr-md px-4 py-3 shadow-scraper-sm">
              <div className="text-scraper-text-primary leading-relaxed">
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-scraper-gradient-primary shadow-scraper-glow">
            <User className="w-4 h-4 text-scraper-text-primary" />
          </div>
        </>
      ) : (
        // Assistant message layout (left-aligned)
        <>
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-scraper-bg-card border border-scraper-border">
            <Bot className="w-4 h-4 text-scraper-accent-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyMessage}
                  className="h-6 w-6 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="text-scraper-text-primary leading-relaxed prose prose-invert max-w-none">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <SourcesList sources={message.sources} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;