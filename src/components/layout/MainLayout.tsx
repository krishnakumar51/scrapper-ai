import { useState } from 'react';
import React from 'react';
import Header from './Header';
import ChatSidebar from '../chat/ChatSidebar';
import SourcePanel from '../chat/SourcePanel';
import { ScrapedSource } from '@/types/chat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sourcesPanelVisible, setSourcesPanelVisible] = useState(false);
  const [currentSources, setCurrentSources] = useState<ScrapedSource[]>([]);

  const handleSourcesUpdate = (sources: ScrapedSource[]) => {
    setCurrentSources(sources);
    setSourcesPanelVisible(sources.length > 0);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSourcesPanel = () => {
    setSourcesPanelVisible(false);
    setCurrentSources([]);
  };

  return (
    <div className="min-h-screen bg-scraper-bg-primary">
      {/* Header */}
      <Header />
      
      {/* Chat Sidebar */}
      <ChatSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main Content */}
      <main 
        className={`pt-14 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-80'
        } ${
          sourcesPanelVisible ? 'mr-80' : 'mr-0'
        }`}
        style={{ 
          minHeight: 'calc(100vh - 3.5rem)',
        }}
      >
        <div className="h-full">
          {/* Clone children and pass onSourcesUpdate prop if it's the ChatInterface */}
          {React.cloneElement(children as React.ReactElement, { 
            onSourcesUpdate: handleSourcesUpdate 
          })}
        </div>
      </main>

      {/* Sources Panel */}
      <SourcePanel
        isVisible={sourcesPanelVisible}
        sources={currentSources}
        onClose={closeSourcesPanel}
      />
    </div>
  );
};

export default MainLayout;