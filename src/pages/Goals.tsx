import { useState } from 'react';
import { useStudyStore } from '@/lib/studyStore';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalDialog } from '@/components/AddGoalDialog';
import { AddProgressDialog } from '@/components/AddProgressDialog';
import { Goal } from '@/types/study';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy } from 'lucide-react';

const Goals = () => {
  const goals = useStudyStore((state) => state.goals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  const activeGoals = goals.filter(g => g.currentValue < g.targetValue);
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue);

  const handleAddProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setProgressDialogOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64 p-8 gradient-dark">
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Study Goals
            </h1>
            <p className="text-muted-foreground">
              Manage and track all your study objectives
            </p>
          </div>
          <AddGoalDialog />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              Active ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeGoals.length === 0 ? (
              <div className="text-center py-16 px-4 bg-card/30 rounded-xl border border-border/50">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No active goals</h3>
                <p className="text-muted-foreground mb-6">
                  Create a new goal to start tracking your progress
                </p>
                <AddGoalDialog />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onAddProgress={() => handleAddProgress(goal)}
                    onClick={() => handleAddProgress(goal)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedGoals.length === 0 ? (
              <div className="text-center py-16 px-4 bg-card/30 rounded-xl border border-border/50">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No completed goals yet</h3>
                <p className="text-muted-foreground">
                  Keep working on your active goals to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onAddProgress={() => handleAddProgress(goal)}
                    onClick={() => handleAddProgress(goal)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedGoal && (
        <AddProgressDialog
          goal={selectedGoal}
          open={progressDialogOpen}
          onOpenChange={setProgressDialogOpen}
        />
      )}
    </div>
  );
};

export default Goals;
