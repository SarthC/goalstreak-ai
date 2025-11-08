import { NavLink } from '@/components/NavLink';
import { Home, Target, Timer, Brain, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import studyTrackerLogo from '@/assets/study-tracker-logo.png';

export const Navigation = () => {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/focus', icon: Timer, label: 'Focus' },
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  ];

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    await signOut();
    // Force a page reload to ensure clean state
    window.location.href = '/auth';
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

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

        {/* User Menu */}
        <div className="hidden md:block mt-auto pt-4 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {user?.email ? getUserInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium truncate max-w-32">
                    {user?.user_metadata?.name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {user?.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Sign Out Button */}
        <div className="md:hidden mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};
