import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  percentage: number;
  category: string;
  delay?: number;
}

export function SkillBar({ name, percentage, category, delay = 0 }: SkillBarProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const getGradientColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "from-blue-500 to-blue-600";
      case "Backend":
        return "from-green-500 to-green-600";
      case "Database":
        return "from-blue-400 to-green-500";
      case "DevOps":
        return "from-green-400 to-blue-500";
      case "Cloud":
        return "from-blue-600 to-green-400";
      default:
        return "from-blue-500 to-green-500";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-white font-medium">{name}</span>
        <span className="text-blue-400 font-semibold">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <motion.div
          className={`skill-bar bg-gradient-to-r ${getGradientColor(category)} h-3 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${animatedPercentage}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">{category}</div>
    </div>
  );
}
