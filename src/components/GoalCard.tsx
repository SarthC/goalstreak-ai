import { Goal } from '@/types/study';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Flame, Target, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onAddProgress: () => void;
  onClick: () => void;
}

export const GoalCard = ({ goal, onAddProgress, onClick }: GoalCardProps) => {
  const percentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isCompleted = percentage >= 100;
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card 
      className="p-6 shadow-card hover:shadow-golden transition-smooth cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-foreground">{goal.title}</h3>
            {isCompleted && (
              <Badge className="gradient-achievement text-primary-foreground border-0">
                Completed
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{goal.subject}</p>
        </div>
        
        {goal.streak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{goal.streak}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-semibold text-foreground">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}% complete</span>
            <span className="text-xs text-muted-foreground">
              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              Due {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
            </span>
          </div>
          
          {goal.dailyTarget && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-xs">{goal.dailyTarget} {goal.unit}/day</span>
            </div>
          )}
        </div>

        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onAddProgress();
          }}
          className="w-full gradient-primary text-primary-foreground border-0 hover:shadow-golden"
          disabled={isCompleted}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isCompleted ? 'Goal Achieved!' : 'Log Progress'}
        </Button>
      </div>
    </Card>
  );
};
