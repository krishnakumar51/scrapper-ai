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
    <div className={`flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 group transition-all duration-200 hover:bg-scraper-bg-card/10 rounded-xl ${
      isUser 
        ? 'bg-transparent justify-end' 
        : 'bg-transparent justify-start'
    }`}>
      {isUser ? (
        // User message layout (right-aligned)
        <>
          {/* Content */}
          <div className="max-w-xs sm:max-w-xl lg:max-w-2xl space-y-1 sm:space-y-2">
            <div className="flex items-center justify-end gap-2">
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyMessage}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card rounded-lg transition-all duration-200"
                >
                  <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-scraper-gradient-primary rounded-2xl rounded-tr-md px-4 sm:px-5 py-3 sm:py-4 shadow-lg border border-scraper-border/20">
              <div className="text-scraper-text-primary leading-relaxed text-base sm:text-[16px]">
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 sm:mb-3 last:mb-0 font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-scraper-gradient-primary shadow-lg ring-2 ring-scraper-accent-primary/20">
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-scraper-text-primary" />
          </div>
        </>
      ) : (
        // Assistant message layout (left-aligned)
        <>
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-scraper-bg-card border-2 border-scraper-accent-primary/30 shadow-md">
            <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-scraper-accent-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2 sm:space-y-3 max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="text-xs text-scraper-text-muted font-medium">WebScraper AI</div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyMessage}
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card rounded-lg transition-all duration-200"
                >
                  <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-scraper-text-muted hover:text-scraper-text-primary hover:bg-scraper-bg-card rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="text-scraper-text-primary leading-relaxed text-base sm:text-[16px] prose prose-invert max-w-none">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className="mb-4 sm:mb-5 last:mb-0 font-normal">
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