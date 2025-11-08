import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp } from 'lucide-react';
import { useStudyStore } from '@/lib/studyStore';
import { toast } from 'sonner';
import { Goal } from '@/types/study';

interface AddProgressDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProgressDialog = ({ goal, open, onOpenChange }: AddProgressDialogProps) => {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const addProgress = useStudyStore((state) => state.addProgress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || parseFloat(value) <= 0) {
      toast.error('Please enter a valid progress value');
      return;
    }

    const progressValue = parseFloat(value);
    const newTotal = goal.currentValue + progressValue;
    
    if (newTotal > goal.targetValue) {
      toast.error(`Progress exceeds goal target. Maximum: ${goal.targetValue - goal.currentValue} ${goal.unit}`);
      return;
    }

    addProgress({
      goalId: goal.id,
      date: new Date(),
      value: progressValue,
      notes: notes || undefined,
    });

    toast.success(`Added ${progressValue} ${goal.unit} to ${goal.title}!`, {
      description: goal.streak > 0 ? `🔥 ${goal.streak + 1} day streak!` : undefined,
    });

    setValue('');
    setNotes('');
    onOpenChange(false);
  };

  const remaining = goal.targetValue - goal.currentValue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Log Progress</DialogTitle>
          <p className="text-sm text-muted-foreground">{goal.title}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current Progress</span>
              <span className="text-lg font-bold text-foreground">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className="text-sm font-semibold text-primary">
                {remaining} {goal.unit}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-foreground">
              Progress Today ({goal.unit}) *
            </Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              placeholder={`e.g., ${goal.dailyTarget || 10}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-background border-border text-foreground"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Max: {remaining} {goal.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What did you study today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background border-border text-foreground resize-none"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 hover:shadow-golden">
            <TrendingUp className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
