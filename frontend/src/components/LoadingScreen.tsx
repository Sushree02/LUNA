import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { StarField } from './StarField';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-deep-night via-twilight-indigo to-indigo-velvet">
      <StarField />
      
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Moon with cat */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <Moon className="w-32 h-32 text-periwinkle glow-soft" />
            
            {/* Sleeping cat on moon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="text-4xl">😴</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="mt-8 body-lg text-periwinkle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}