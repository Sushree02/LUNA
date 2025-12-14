import { Home, Search, Library } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show nav on player screen
  if (location.pathname === '/player') {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-6 pb-6">
        <motion.nav
          className="glass-card rounded-3xl p-4 flex justify-around items-center"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/search' && location.pathname.startsWith('/mood'));
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  isActive ? 'bg-violet-twilight/30' : ''
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  style={{ width: 24, height: 24 }}
                  className={isActive ? 'text-violet-twilight' : 'text-lavender'}
                />
                <span className={`body-sm ${isActive ? 'text-violet-twilight' : 'text-lavender'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>
    </div>
  );
}