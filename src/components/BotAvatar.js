import { motion } from 'framer-motion';

export function BotAvatar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg mb-2 border-4 border-white"
    >
      <span className="text-4xl">🤖</span>
    </motion.div>
  );
}