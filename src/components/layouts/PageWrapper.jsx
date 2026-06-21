import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -15, scale: 1.02 },
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
