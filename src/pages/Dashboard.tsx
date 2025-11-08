import { useState } from 'react';
import { useStudyStore } from '@/lib/studyStore';
import { StatCard } from '@/components/StatCard';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalDialog } from '@/components/AddGoalDialog';
import { AddProgressDialog } from '@/components/AddProgressDialog';
import { Target, Flame, Trophy, Clock } from 'lucide-react';
import { Goal } from '@/types/study';

const Dashboard = () => {
  const goals = useStudyStore((state) => state.goals);
  const focusSessions = useStudyStore((state) => state.focusSessions);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  const activeGoals = goals.filter(g => g.currentValue < g.targetValue);
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue);
  const totalStreak = goals.reduce((sum, goal) => sum + goal.streak, 0);
  const maxStreak = Math.max(...goals.map(g => g.streak), 0);
  const totalFocusTime = focusSessions.reduce((sum, session) => sum + session.duration, 0);

  const handleAddProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setProgressDialogOpen(true);
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setProgressDialogOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64 p-8 gradient-dark">
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome Back! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's make today count. Track your progress and achieve your goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Goals"
            value={activeGoals.length}
            icon={Target}
            trend={`${completedGoals.length} completed`}
          />
          <StatCard
            title="Best Streak"
            value={maxStreak}
            icon={Flame}
            gradient="primary"
            trend={maxStreak > 0 ? "Keep it going!" : "Start your first streak"}
          />
          <StatCard
            title="Total Achievements"
            value={completedGoals.length}
            icon={Trophy}
            gradient="achievement"
            trend="Goals completed"
          />
          <StatCard
            title="Focus Time"
            value={`${Math.floor(totalFocusTime / 60)}h`}
            icon={Clock}
            gradient="blue"
            trend="Total study hours"
          />
        </div>

        {/* Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
            <AddGoalDialog />
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-16 px-4 bg-card/30 rounded-xl border border-border/50">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first study goal to start tracking your progress
              </p>
              <AddGoalDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddProgress={() => handleAddProgress(goal)}
                  onClick={() => handleGoalClick(goal)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card/30 rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Tips 💡</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Log your progress daily to maintain your streak</li>
            <li>• Use the Focus Timer to stay concentrated during study sessions</li>
            <li>• Check Analytics to identify your most productive times</li>
            <li>• Ask the AI Assistant for personalized study plans</li>
          </ul>
        </div>
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

export default Dashboard;
