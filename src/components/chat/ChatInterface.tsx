import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStorage } from '@/hooks/useChatStorage';
import { Message, ScrapedSource } from '@/types/chat';
import MessageBubble from './MessageBubble';
import FloatingInput from './FloatingInput';
import TypingIndicator from './TypingIndicator';

interface ChatInterfaceProps {
  onSourcesUpdate?: (sources: ScrapedSource[]) => void;
}

// Mock AI responses and sources for demonstration
const getMockResponse = (userMessage: string): { response: string; sources: ScrapedSource[] } => {
  const mockSources: ScrapedSource[] = [];
  let response = '';

  // Check if message is about scraping or data extraction
  if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('scrape') ||
    userMessage.toLowerCase().includes('amazon') || userMessage.toLowerCase().includes('flipkart')) {

    // Generate mock sources
    mockSources.push(
      {
        id: `source_${Date.now()}_1`,
        url: 'https://www.amazon.com/products/search',
        title: 'Amazon Product Search Results',
        favicon: 'https://www.amazon.com/favicon.ico',
        status: 'success',
        timestamp: new Date().toISOString(),
      },
      {
        id: `source_${Date.now()}_2`,
        url: 'https://www.flipkart.com/search',
        title: 'Flipkart Product Listings',
        favicon: 'https://www.flipkart.com/favicon.ico',
        status: 'success',
        timestamp: new Date().toISOString(),
      }
    );

    response = `I've successfully scraped pricing information from multiple e-commerce platforms. Based on the data collected from Amazon and Flipkart, here's what I found:

**Product Pricing Analysis:**

• **Amazon**: Current listings show competitive pricing with frequent discounts
• **Flipkart**: Similar price range with additional cashback offers
• **Price Comparison**: Fluctuations detected across platforms

The scraping process accessed ${mockSources.length} sources to gather comprehensive pricing data. All sources were successfully processed and the information has been analyzed for accuracy.

Would you like me to monitor these prices for changes or scrape additional e-commerce platforms?`;
  } else {
    response = `I understand you're asking about "${userMessage}". 

As WebScraper AI, I can help you extract and analyze data from websites. I specialize in:

• **Price Monitoring**: Track product prices across e-commerce platforms
• **Data Extraction**: Gather structured information from websites  
• **Content Scraping**: Extract articles, reviews, and social media content
• **Market Analysis**: Compare data across multiple sources
• **Real-time Updates**: Monitor websites for changes

Try asking me to scrape specific data like "Get the price of MacBook from Amazon and Flipkart" to see the source panel in action!`;
  }

  return { response, sources: mockSources };
};

const ChatInterface = ({ onSourcesUpdate }: ChatInterfaceProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentSources, setCurrentSources] = useState<ScrapedSource[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { getCurrentSession, addMessage } = useChatStorage();
  const currentSession = getCurrentSession();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added (ChatGPT-style behavior)
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          // Use setTimeout to ensure DOM has updated
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 100);
        }
      }
    };
    
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const simulateScrapingProcess = async (sources: ScrapedSource[]) => {
    // Start with loading sources
    const loadingSources = sources.map(source => ({ ...source, status: 'loading' as const }));
    setCurrentSources(loadingSources);
    onSourcesUpdate?.(loadingSources);

    // Simulate progressive loading
    for (let i = 0; i < sources.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      const updatedSources = loadingSources.map((source, index) =>
        index <= i ? { ...source, status: 'success' as const } : source
      );

      setCurrentSources(updatedSources);
      onSourcesUpdate?.(updatedSources);
    }
  };



  const handleSendPrompt = async (message: string) => {

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // Generates a unique ID
        content: message,
        role: 'user',
      }
    ]);

    setIsTyping(true);

    // Get mock response and sources
    const { response, sources } = getMockResponse(message);

    // If there are sources, simulate the scraping process
    if (sources.length > 0) {
      await simulateScrapingProcess(sources);
    }

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: response,
        role: 'assistant',
        sources: sources.length > 0 ? sources : undefined,
      }
    ]);

    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {messages.length === 0 ? (
        // ChatGPT-style centered layout when empty
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24 pt-16">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-semibold text-scraper-text-primary mb-4 bg-gradient-to-r from-scraper-text-primary to-scraper-accent-primary bg-clip-text text-transparent">
              WebScraper AI
            </h1>

            <p className="text-scraper-text-secondary text-base sm:text-lg mb-8 leading-relaxed font-medium">
              Intelligent web data extraction & analysis
            </p>
          </div>

          {/* Centered Input */}
          <div className="w-full max-w-3xl mx-auto mt-8">
            <FloatingInput onSendMessage={handleSendPrompt} disabled={isTyping} centered={true} />
          </div>
        </div>
      ) : (
        // Regular chat layout with messages
        <>
          <ScrollArea className="flex-1 px-4 sm:px-6" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto pt-8 pb-32">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={message.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <MessageBubble message={message} />
                  </div>
                ))}
                
                {isTyping && (
                  <div className="animate-fade-in">
                    <TypingIndicator />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Input Area */}
          <FloatingInput onSendMessage={handleSendPrompt} disabled={isTyping} />
        </>
      )}
    </div>
  );
};

export default ChatInterface;