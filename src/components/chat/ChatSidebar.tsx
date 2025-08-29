import { useState } from 'react';
import { MessageSquare, Search, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStorage } from '@/hooks/useChatStorage';
import { ChatSession } from '@/types/chat';

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const ChatSidebar = ({ isCollapsed, onToggle }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { chatState, createSession, setCurrentSession, deleteSession } = useChatStorage();

  const filteredSessions = chatState.sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = () => {
    createSession();
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`fixed left-0 top-14 bottom-0 bg-scraper-bg-secondary border-r border-scraper-border shadow-scraper-sm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-scraper-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-scraper-accent-primary" />
            <span className="text-scraper-text-primary font-medium">Chat History</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          {/* New Chat Button */}
          <div className="p-4 border-b border-scraper-border">
            <Button
              onClick={handleNewChat}
              className="w-full bg-scraper-gradient-primary hover:opacity-90 text-scraper-text-primary shadow-scraper-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-scraper-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-scraper-text-muted" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-scraper-input border-scraper-border text-scraper-text-primary placeholder:text-scraper-text-muted focus:border-scraper-accent-primary"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-scraper-text-muted mx-auto mb-2" />
                  <p className="text-scraper-text-muted text-sm">
                    {searchTerm ? 'No matching chats found' : 'Start your first conversation'}
                  </p>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionSelect(session.id)}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                      chatState.currentSession === session.id
                        ? 'bg-scraper-accent-primary text-scraper-text-primary shadow-scraper-glow'
                        : 'hover:bg-scraper-bg-card text-scraper-text-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">
                          {session.title}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatDate(session.updatedAt)} • {session.messages.length} messages
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 text-scraper-text-muted hover:text-scraper-accent-primary transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            className="w-full h-10 bg-scraper-gradient-primary hover:opacity-90 text-scraper-text-primary shadow-scraper-sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;