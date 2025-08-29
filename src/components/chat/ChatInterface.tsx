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
  const [messages, setMessages] = useState<Message[]>([])

  const { getCurrentSession, addMessage } = useChatStorage();
  const currentSession = getCurrentSession();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

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

  const handleSendMessage = async (message: string) => {

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

    // Clear sources after some time if no more messages
    if (sources.length > 0) {
      setTimeout(() => {
        setCurrentSources([]);
        onSourcesUpdate?.([]);
      }, 30000); // Clear after 30 seconds
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
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto py-8">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-scraper-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-scraper-glow">
                <svg className="w-8 h-8 text-scraper-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-scraper-text-primary mb-4">
                Welcome to WebScraper AI
              </h1>

              <p className="text-scraper-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Your intelligent web data extraction assistant. I can scrape websites,
                compare prices, extract content, and analyze data from multiple sources in real-time.
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-scraper-bg-card border border-scraper-border rounded-xl p-6">
                  <h3 className="text-scraper-text-primary font-semibold mb-2">Price Monitoring</h3>
                  <p className="text-scraper-text-muted text-sm">
                    "Compare MacBook prices across Amazon, Flipkart, and other e-commerce sites"
                  </p>
                </div>

                <div className="bg-scraper-bg-card border border-scraper-border rounded-xl p-6">
                  <h3 className="text-scraper-text-primary font-semibold mb-2">Data Extraction</h3>
                  <p className="text-scraper-text-muted text-sm">
                    "Extract all product reviews from a specific category or brand"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="space-y-1">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <FloatingInput onSendMessage={handleSendPrompt} disabled={isTyping} />
    </div>
  );
};

export default ChatInterface;