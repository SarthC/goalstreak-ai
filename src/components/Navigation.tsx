import { NavLink } from '@/components/NavLink';
import { Home, Target, Timer, Brain, TrendingUp } from 'lucide-react';
import studyTrackerLogo from '@/assets/study-tracker-logo.png';

export const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/focus', icon: Timer, label: 'Focus' },
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:left-0 md:bottom-auto md:right-auto md:w-64 bg-card/80 backdrop-blur-lg border-t md:border-r md:border-t-0 border-border/50">
      <div className="flex md:flex-col items-center md:items-start p-4 md:p-6">
        <div className="hidden md:flex items-center gap-3 mb-8">
          <img src={studyTrackerLogo} alt="Study Tracker Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              StudyTracker
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Achieve Your Goals</p>
          </div>
        </div>
        
        <div className="flex md:flex-col gap-2 md:gap-1 w-full justify-around md:justify-start">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              activeClassName="text-primary bg-primary/10 hover:bg-primary/10"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
