import { useState } from 'react';
import { Brain, Send, User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendMessage, ChatMessage } from '@/lib/aiService';
import { useToast } from '@/hooks/use-toast';

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64 p-8 gradient-dark">
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            AI Study Assistant
          </h1>
          <p className="text-muted-foreground">
            Get personalized study plans and instant doubt resolution
          </p>
        </div>

        <Card className="h-[600px] shadow-golden bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary animate-glow" />
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Assistant</h2>
                <p className="text-sm text-muted-foreground">Powered by GPT-4o</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="text-center space-y-4">
                <Bot className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">How can I help you study today?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Ask me about study plans, explain topics, generate practice questions, or get study technique recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <Bot className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    )}
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <User className="w-8 h-8 text-muted-foreground mt-1 flex-shrink-0" />
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Bot className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-6 border-t border-border/50">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="flex-1 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
