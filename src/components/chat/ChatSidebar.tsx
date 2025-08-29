import { useState } from 'react';
import { MessageSquare, Search, Trash2, Plus, ChevronLeft, ChevronRight, LayoutDashboard, BarChart3, Settings, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';
import { useChatStorage } from '@/hooks/useChatStorage';
import { ChatSession } from '@/types/chat';

interface ChatSidebarProps {
  isChatPanelOpen: boolean;
  onChatToggle: () => void;
}

const ChatSidebar = ({ isChatPanelOpen, onChatToggle }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const { chatState, createSession, setCurrentSession, deleteSession } = useChatStorage();

  const isActive = (path: string) => location.pathname === path;

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
    <>
      {/* Main Navigation Bar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-scraper-bg-secondary border-r border-scraper-border shadow-scraper-sm z-50">
        {/* Brand Logo */}
        <div className="flex items-center justify-center p-4 border-b border-scraper-border h-16">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-scraper-gradient-primary rounded-xl flex items-center justify-center shadow-scraper-md hover:shadow-scraper-lg transition-all duration-200 hover:scale-105">
              <Brain className="w-6 h-6 text-scraper-text-primary" />
            </div>
          </Link>
        </div>

        {/* Navigation Icons */}
        <nav className="p-3 space-y-3">
          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatToggle}
            className={`w-10 h-10 p-0 rounded-xl transition-all duration-200 hover:scale-105 ${
              isChatPanelOpen
                ? 'bg-scraper-accent-primary text-scraper-text-primary shadow-scraper-glow'
                : 'text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card'
            }`}
            title="Chat History"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105 ${
              isActive('/dashboard')
                ? 'bg-scraper-accent-primary text-scraper-text-primary shadow-scraper-glow'
                : 'text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card'
            }`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>

          {/* Metrics */}
          <Link
            to="/metrics"
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105 ${
              isActive('/metrics')
                ? 'bg-scraper-accent-primary text-scraper-text-primary shadow-scraper-glow'
                : 'text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card'
            }`}
            title="Metrics"
          >
            <BarChart3 className="w-5 h-5" />
          </Link>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 rounded-xl text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card transition-all duration-200 hover:scale-105"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </nav>

        {/* New Chat Button */}
        <div className="absolute bottom-4 left-3 right-3">
          <Button
            onClick={handleNewChat}
            className="w-10 h-10 p-0 bg-scraper-gradient-primary hover:opacity-90 text-scraper-text-primary shadow-scraper-md hover:shadow-scraper-lg transition-all duration-200 hover:scale-105 rounded-xl"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat History Panel */}
      <div
        className={`fixed left-16 top-0 bottom-0 w-80 bg-scraper-bg-secondary border-r border-scraper-border shadow-scraper-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isChatPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-scraper-border h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-scraper-gradient-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-scraper-text-primary" />
            </div>
            <div>
              <h2 className="text-scraper-text-primary font-semibold text-lg">Chat History</h2>
              <p className="text-scraper-text-muted text-xs">
                {chatState.sessions.length} conversation{chatState.sessions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatToggle}
            className="h-8 w-8 text-scraper-text-secondary hover:text-scraper-text-primary hover:bg-scraper-bg-card rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-scraper-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-scraper-text-muted" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-scraper-input border-scraper-border text-scraper-text-primary placeholder:text-scraper-text-muted focus:border-scraper-accent-primary rounded-xl"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-scraper-bg-card rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-scraper-text-muted" />
                </div>
                <p className="text-scraper-text-muted text-sm">
                  {searchTerm ? 'No matching conversations found' : 'Start your first conversation'}
                </p>
                <p className="text-scraper-text-muted text-xs mt-2">
                  Click the + button to create a new chat
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    chatState.currentSession === session.id
                      ? 'bg-scraper-accent-primary text-scraper-text-primary shadow-scraper-glow border border-scraper-accent-primary/30'
                      : 'hover:bg-scraper-bg-card text-scraper-text-secondary border border-transparent hover:border-scraper-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm mb-1">
                        {session.title}
                      </p>
                      <p className="text-xs opacity-70">
                        {formatDate(session.updatedAt)} • {session.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-scraper-text-muted hover:text-scraper-accent-primary transition-all duration-200 hover:bg-scraper-bg-secondary rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ChatSidebar;