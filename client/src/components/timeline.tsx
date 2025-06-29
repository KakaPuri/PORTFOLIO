import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  company?: string;
  institution?: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  type: "experience" | "education";
}

export function Timeline({ items, type }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-full" />
      
      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex-shrink-0 w-16 h-16 glass-effect rounded-full flex items-center justify-center mr-8 z-10">
              {type === "experience" ? (
                <Calendar className="text-blue-400 text-xl" />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" />
              )}
            </div>
            
            <div className="glass-effect rounded-2xl p-6 flex-1 hover-glow transition-all duration-300">
              <h3 className="text-xl font-semibold text-blue-400 mb-1">
                {item.title}
              </h3>
              <p className="text-green-400 font-medium mb-2">
                {item.company || item.institution}
              </p>
              <div className="flex items-center text-gray-400 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {item.startDate} - {item.current ? "Present" : item.endDate}
                </span>
                {item.current && (
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Current
                  </span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
