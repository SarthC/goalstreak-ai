import { useStudyStore } from '@/lib/studyStore';
import { Card } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

const Analytics = () => {
  const goals = useStudyStore((state) => state.goals);
  const progressEntries = useStudyStore((state) => state.progressEntries);
  const focusSessions = useStudyStore((state) => state.focusSessions);

  const totalProgress = progressEntries.reduce((sum, entry) => sum + entry.value, 0);
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue).length;
  const totalFocusTime = Math.floor(focusSessions.reduce((sum, session) => sum + session.duration, 0) / 60);
  const avgStreak = goals.length > 0 ? Math.floor(goals.reduce((sum, g) => sum + g.streak, 0) / goals.length) : 0;

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64 p-8 gradient-dark">
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your progress and identify patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Progress"
            value={totalProgress}
            icon={TrendingUp}
            trend="All time"
            gradient="primary"
          />
          <StatCard
            title="Goals Completed"
            value={completedGoals}
            icon={Target}
            trend={`${goals.length} total goals`}
            gradient="achievement"
          />
          <StatCard
            title="Study Hours"
            value={`${totalFocusTime}h`}
            icon={Clock}
            trend="Focus time logged"
            gradient="blue"
          />
          <StatCard
            title="Avg Streak"
            value={avgStreak}
            icon={Award}
            trend="Days on average"
          />
        </div>

        <Card className="p-8 shadow-card bg-card/50 backdrop-blur-sm border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6">Progress Over Time</h2>
          
          {progressEntries.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Start logging progress to see your analytics here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const goalProgress = progressEntries.filter(e => e.goalId === goal.id);
                const percentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                
                return (
                  <div key={goal.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-foreground">{goal.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {goalProgress.length} entries
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-8 shadow-card bg-card/50 backdrop-blur-sm border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6">Study Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Most Active Subject</h3>
              {goals.length > 0 ? (
                <p className="text-2xl font-bold text-primary">
                  {goals.reduce((prev, current) => 
                    prev.currentValue > current.currentValue ? prev : current
                  ).subject}
                </p>
              ) : (
                <p className="text-muted-foreground">No data yet</p>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Total Focus Sessions</h3>
              <p className="text-2xl font-bold text-secondary">
                {focusSessions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
