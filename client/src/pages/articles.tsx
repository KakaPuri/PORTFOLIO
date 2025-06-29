import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedBlueBg from "@/components/animated-background";
import { Link } from "wouter";

export default function Articles() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: api.getArticles,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "React":
        return "bg-blue-500/20 text-blue-400";
      case "Node.js":
        return "bg-green-500/20 text-green-400";
      case "Cloud":
        return "bg-blue-500/20 text-blue-400";
      case "Mobile":
        return "bg-green-500/20 text-green-400";
      case "AI/ML":
        return "bg-blue-500/20 text-blue-400";
      case "Security":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 hari lalu";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`;
    return `${Math.ceil(diffDays / 30)} bulan lalu`;
  };

  return (
    <>
      <AnimatedBlueBg />
      <div className="relative z-10 pt-24">
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold gradient-text mb-6">Artikel & Portfolio</h1>
              <p className="text-xl text-gray-300">Koleksi artikel teknologi dan showcase project terbaru</p>
            </motion.div>
            
            {articles.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-gray-400 text-lg">Belum ada artikel yang dipublikasikan.</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="glass-effect rounded-2xl overflow-hidden hover-glow transition-all duration-300 border-white/10 h-full">
                      <div className="relative overflow-hidden">
                        <img 
                          src={article.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                          alt={article.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`${getCategoryColor(article.category)} border-0`}>
                            {article.category}
                          </Badge>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{getTimeAgo(article.createdAt || new Date().toISOString())}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-semibold">
                          <Link href={`/articles/${article.id}`} className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-semibold">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
