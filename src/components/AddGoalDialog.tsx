import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useStudyStore } from '@/lib/studyStore';
import { toast } from 'sonner';

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Geography', 'Economics', 'Psychology', 'Other'
];

const units = ['Pages', 'Chapters', 'Hours', 'Problems', 'Videos', 'Lectures'];

export const AddGoalDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    targetValue: '',
    unit: 'Pages',
    deadline: '',
    dailyTarget: '',
  });

  const addGoal = useStudyStore((state) => state.addGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.targetValue || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    addGoal({
      title: formData.title,
      subject: formData.subject,
      targetValue: parseFloat(formData.targetValue),
      currentValue: 0,
      unit: formData.unit,
      deadline: new Date(formData.deadline),
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      dailyTarget: formData.dailyTarget ? parseFloat(formData.dailyTarget) : undefined,
    });

    toast.success('Goal created successfully!');
    setOpen(false);
    setFormData({
      title: '',
      subject: '',
      targetValue: '',
      unit: 'Pages',
      deadline: '',
      dailyTarget: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground border-0 hover:shadow-golden">
          <Plus className="w-4 h-4 mr-2" />
          Create New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Create Study Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Complete Calculus Textbook"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">Subject *</Label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-foreground">Target *</Label>
              <Input
                id="target"
                type="number"
                placeholder="300"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-foreground">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-foreground">Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyTarget" className="text-foreground">Daily Target (Optional)</Label>
            <Input
              id="dailyTarget"
              type="number"
              placeholder="e.g., 10"
              value={formData.dailyTarget}
              onChange={(e) => setFormData({ ...formData, dailyTarget: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 hover:shadow-golden">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
