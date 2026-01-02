import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, Home, Clapperboard, MonitorPlay, Film, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'DramaBox', icon: Clapperboard, path: '/provider/dramabox' },
    { label: 'NetShort', icon: MonitorPlay, path: '/provider/netshort' },
    { label: 'Melolo', icon: Film, path: '/provider/melolo' },
    { label: 'Anime', icon: MonitorPlay, path: '/provider/anime' },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">D</div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               DramaCids
             </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-gray-400"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background md:hidden pt-20 px-4 animate-fade-in">
              <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                      <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                              cn(
                                  "flex items-center gap-4 text-lg font-medium p-3 rounded-lg transition-colors",
                                  isActive ? "bg-surfaceHighlight text-primary" : "text-gray-400 hover:bg-surfaceHighlight/50"
                              )
                          }
                      >
                          <item.icon className="h-6 w-6" />
                          {item.label}
                      </NavLink>
                  ))}
              </nav>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav (Optional, maybe specific for core actions if drawer is minimal) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-background/90 backdrop-blur-md p-2 flex justify-around items-center z-50">
           <NavLink to="/" className={({isActive}) => cn("flex flex-col items-center p-2 rounded", isActive ? "text-primary" : "text-gray-400")}>
               <Home className="h-6 w-6" />
               <span className="text-[10px] mt-1">Home</span>
           </NavLink>
           <NavLink to="/search" className={({isActive}) => cn("flex flex-col items-center p-2 rounded", isActive ? "text-primary" : "text-gray-400")}>
               <Search className="h-6 w-6" />
               <span className="text-[10px] mt-1">Search</span>
           </NavLink>
            {/* Can add more bottom nav items here if needed */}
      </div>

    </div>
  );
}
