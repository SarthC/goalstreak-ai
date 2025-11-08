import { Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AIAssistant = () => {
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

        <Card className="p-12 shadow-golden bg-card/50 backdrop-blur-sm border-border/50 text-center">
          <Brain className="w-20 h-20 mx-auto mb-6 text-primary animate-glow" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            AI Assistant Coming Soon
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're building an intelligent AI assistant powered by advanced language models to help you with:
          </p>
          <ul className="mt-6 space-y-2 text-left max-w-md mx-auto text-muted-foreground">
            <li>• Personalized study plan creation</li>
            <li>• Instant doubt resolution</li>
            <li>• Topic explanations and summaries</li>
            <li>• Practice question generation</li>
            <li>• Study technique recommendations</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
