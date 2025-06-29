import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api } from "@/lib/api";
import { Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedBlueBg from "@/components/animated-background";

export default function ArticleDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: article, isLoading } = useQuery({
    queryKey: ["/api/articles", id],
    queryFn: () => api.getArticle(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-400 ml-4">Loading article...</p>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Article not found.</p>
      </div>
    );
  }

  return (
    <>
      <AnimatedBlueBg />
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/articles" className="inline-flex items-center text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Articles
          </Link>
          <Card className="glass-effect rounded-3xl overflow-hidden border-white/10">
            <CardContent className="p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-full max-w-md h-60 flex items-center justify-center bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4">
                  <img
                    src={article.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240"}
                    alt={article.title}
                    className="w-full h-full object-cover object-center"
                    onError={e => { e.currentTarget.src = "https://via.placeholder.com/400x240?text=No+Image"; }}
                  />
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-0">{article.category}</Badge>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(article.createdAt || new Date()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">{article.title}</h1>
              <p className="text-base text-gray-300 mb-4 text-center">{article.excerpt}</p>
              <div className="prose prose-invert max-w-none text-gray-200 mx-auto" dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 