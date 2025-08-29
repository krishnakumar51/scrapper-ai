import { useState } from 'react';
import React from 'react';
import ChatSidebar from '../chat/ChatSidebar';
import SourcePanel from '../chat/SourcePanel';
import { ScrapedSource } from '@/types/chat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [sourcesPanelVisible, setSourcesPanelVisible] = useState(false);
  const [currentSources, setCurrentSources] = useState<ScrapedSource[]>([]);

  const handleSourcesUpdate = (sources: ScrapedSource[]) => {
    setCurrentSources(sources);
    setSourcesPanelVisible(sources.length > 0);
  };



  const closeSourcesPanel = () => {
    setSourcesPanelVisible(false);
    setCurrentSources([]);
  };

  return (
    <div className="min-h-screen bg-scraper-bg-primary">

      
      {/* Chat Sidebar */}
      <ChatSidebar 
        isChatPanelOpen={isChatPanelOpen} 
        onChatToggle={() => setIsChatPanelOpen(!isChatPanelOpen)} 
      />
      
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isChatPanelOpen ? 'ml-96' : 'ml-16'
        } ${
          sourcesPanelVisible ? 'mr-80' : 'mr-0'
        }`}
        style={{ 
          minHeight: '100vh',
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