import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useStudyStore } from '@/lib/studyStore';
import { toast } from 'sonner';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const goals = useStudyStore((state) => state.goals);
  const addFocusSession = useStudyStore((state) => state.addFocusSession);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak && sessionStartTime) {
      // Focus session completed
      addFocusSession({
        goalId: selectedGoalId || undefined,
        duration: FOCUS_TIME,
        startTime: sessionStartTime,
        endTime: new Date(),
        completed: true,
      });

      toast.success('Focus session completed! 🎉', {
        description: 'Time for a break',
      });

      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    } else {
      // Break completed
      toast.success('Break over! Ready for another session?');
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
    }

    setSessionStartTime(null);
  };

  const toggleTimer = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100;

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64 p-8 gradient-dark flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Focus Timer
          </h1>
          <p className="text-muted-foreground">
            Stay focused with the Pomodoro technique
          </p>
        </div>

        <Card className="p-8 md:p-12 shadow-golden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-8">
            {/* Timer Display */}
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={isBreak ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isBreak && <Coffee className="w-8 h-8 mb-2 text-secondary" />}
                  <div className="text-6xl md:text-7xl font-bold text-foreground">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {isBreak ? 'Break Time' : 'Focus Mode'}
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Selection */}
            {!isBreak && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Link to Goal (Optional)
                </label>
                <Select
                  value={selectedGoalId}
                  onValueChange={setSelectedGoalId}
                  disabled={isRunning}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="">No goal</SelectItem>
                    {goals.filter(g => g.currentValue < g.targetValue).map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={toggleTimer}
                size="lg"
                className={isBreak ? "gradient-blue text-secondary-foreground" : "gradient-primary text-primary-foreground"}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={resetTimer}
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Focus: 25 minutes • Break: 5 minutes</p>
              <p>Complete 4 focus sessions, then take a longer 15-30 minute break</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FocusTimer;
