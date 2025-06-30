import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  FileText, Users, Mail, Eye, Plus, Edit, Trash2, Download, 
  BarChart3, Save, Settings, Archive, LogOut, Lock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema, insertSkillSchema, insertProfileSchema, insertActivitySchema, insertEducationSchema, insertValueSchema } from "@shared/schema";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AnimatedBlueBg from "@/components/animated-background";

// Login form schema
const loginSchema = {
  username: "",
  password: "",
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [editingValue, setEditingValue] = useState<any>(null);

  const loginForm = useForm({
    defaultValues: loginSchema,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: api.getArticles,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: api.getSkills,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages"],
    queryFn: api.getMessages,
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: api.getProfile,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: api.getActivities,
  });

  const { data: education = [] } = useQuery({
    queryKey: ["/api/education"],
    queryFn: api.getEducation,
  });

  const { data: values = [] } = useQuery({
    queryKey: ["/api/values"],
    queryFn: api.getValues,
  });

  const articleForm = useForm({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      imageUrl: "",
      published: false,
    },
  });

  const profileForm = useForm({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      age: profile?.age || 0,
      position: profile?.position || "",
      tagline: profile?.tagline || "",
      bio: profile?.bio || "",
      imageUrl: profile?.imageUrl || "",
    },
  });

  const activityForm = useForm({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: { title: "", description: "", icon: "", order: 0 },
  });

  const educationForm = useForm({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: { degree: "", institution: "", description: "", startDate: "", endDate: "", order: 0 },
  });

  const skillForm = useForm({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      category: "",
      percentage: 50,
      icon: "",
      order: 0,
    },
  });

  const valueForm = useForm({
    resolver: zodResolver(insertValueSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      order: 0,
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: api.createArticle,
    onSuccess: () => {
      toast({ title: "Article created successfully!" });
      articleForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Failed to create article", variant: "destructive" });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateArticle(id, data),
    onSuccess: () => {
      toast({ title: "Article updated successfully!" });
      setEditingArticle(null);
      articleForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Failed to update article", variant: "destructive" });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: api.deleteArticle,
    onSuccess: () => {
      toast({ title: "Article deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Failed to delete article", variant: "destructive" });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      setEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({ 
        title: "Failed to update profile", 
        description: error?.message || "Please check all required fields",
        variant: "destructive" 
      });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: api.createActivity,
    onSuccess: () => {
      toast({ title: "Activity created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      activityForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create Activity", variant: "destructive" });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateActivity(id, data),
    onSuccess: () => {
      toast({ title: "Activity updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setEditingActivity(null);
      activityForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update Activity", variant: "destructive" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: api.deleteActivity,
    onSuccess: () => {
      toast({ title: "Activity deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: () => {
      toast({ title: "Failed to delete Activity", variant: "destructive" });
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: api.createEducation,
    onSuccess: () => {
      toast({ title: "Education created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      educationForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create Education", variant: "destructive" });
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateEducation(id, data),
    onSuccess: () => {
      toast({ title: "Education updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      setEditingEducation(null);
      educationForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update Education", variant: "destructive" });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: api.deleteEducation,
    onSuccess: () => {
      toast({ title: "Education deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
    },
    onError: () => {
      toast({ title: "Failed to delete Education", variant: "destructive" });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: api.createSkill,
    onSuccess: () => {
      toast({ title: "Skill created successfully!" });
      skillForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => {
      toast({ title: "Failed to create skill", variant: "destructive" });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateSkill(id, data),
    onSuccess: () => {
      toast({ title: "Skill updated successfully!" });
      setEditingSkill(null);
      skillForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => {
      toast({ title: "Failed to update skill", variant: "destructive" });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: api.deleteSkill,
    onSuccess: () => {
      toast({ title: "Skill deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => {
      toast({ title: "Failed to delete skill", variant: "destructive" });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: api.deleteMessage,
    onSuccess: () => {
      toast({ title: "Message deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  const createValueMutation = useMutation({
    mutationFn: api.createValue,
    onSuccess: () => {
      toast({ title: "Value created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
      valueForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create value", variant: "destructive" });
    },
  });

  const updateValueMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateValue(id, data),
    onSuccess: () => {
      toast({ title: "Value updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
      setEditingValue(null);
      valueForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update value", variant: "destructive" });
    },
  });

  const deleteValueMutation = useMutation({
    mutationFn: api.deleteValue,
    onSuccess: () => {
      toast({ title: "Value deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/values"] });
    },
    onError: () => {
      toast({ title: "Failed to delete value", variant: "destructive" });
    },
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Update profile form when profile data changes
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        age: profile.age || 0,
        position: profile.position || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        imageUrl: profile.imageUrl || "",
      });
    }
  }, [profile, profileForm]);

  const checkAuthStatus = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('adminSessionId');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminSessionId');
    } finally {
      setIsLoading(false);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('adminSessionId', data.sessionId);
      setIsLoggedIn(true);
      toast({ title: "Login successful!" });
    },
    onError: () => {
      toast({ title: "Invalid username or password", variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem('adminSessionId');
      if (sessionId) {
        await fetch('/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionId}`
          }
        });
      }
    },
    onSuccess: () => {
      localStorage.removeItem('adminSessionId');
      setIsLoggedIn(false);
      toast({ title: "Logout successful!" });
    },
  });

  const onSubmitLogin = (data: { username: string; password: string }) => {
    loginMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Lock className="text-blue-400 text-xl" />
              </div>
              <CardTitle className="text-2xl font-bold gradient-text">Admin Login</CardTitle>
              <p className="text-gray-400">Masuk ke dashboard admin</p>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan username"
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Masukkan password"
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Loading..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const onSubmitArticle = (data: any) => {
    if (editingArticle) {
      updateArticleMutation.mutate({ id: editingArticle.id, data });
    } else {
      createArticleMutation.mutate(data);
    }
  };

  const onSubmitProfile = (data: any) => {
    // Validate required fields
    if (!data.name || !data.email || !data.bio) {
      toast({ 
        title: "Validation Error", 
        description: "Name, Email, and Bio are required fields",
        variant: "destructive" 
      });
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast({ 
        title: "Invalid Email", 
        description: "Please enter a valid email address",
        variant: "destructive" 
      });
      return;
    }
    // Remove id if present
    const { id, ...profileData } = data;
    // Ensure age is a number
    profileData.age = Number(profileData.age) || 0;
    // Ensure all string fields are not null/undefined
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined || profileData[key] === null) {
        profileData[key] = typeof profileData[key] === 'number' ? 0 : '';
      }
    });
    updateProfileMutation.mutate(profileData);
  };

  const onSubmitActivity = (data: any) => {
    if (editingActivity) {
      updateActivityMutation.mutate({ id: editingActivity.id, data });
    } else {
      createActivityMutation.mutate(data);
    }
  };

  const onSubmitEducation = (data: any) => {
    if (editingEducation) {
      updateEducationMutation.mutate({ id: editingEducation.id, data });
    } else {
      createEducationMutation.mutate(data);
    }
  };

  const onSubmitSkill = (data: any) => {
    // Validasi field wajib
    if (!data.name || !data.category || data.percentage === undefined || data.percentage === null) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill.id, data });
    } else {
      createSkillMutation.mutate(data);
    }
  };

  const onSubmitValue = (data: any) => {
    if (editingValue) {
      updateValueMutation.mutate({ id: editingValue.id, data });
    } else {
      createValueMutation.mutate(data);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    articleForm.reset(article);
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    articleForm.reset();
  };

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity);
    activityForm.reset(activity);
  };

  const handleEditEducation = (edu: any) => {
    setEditingEducation(edu);
    educationForm.reset(edu);
  };

  const handleCancelEditActivity = () => {
    setEditingActivity(null);
    activityForm.reset();
  };

  const handleCancelEditEducation = () => {
    setEditingEducation(null);
    educationForm.reset();
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill);
    skillForm.reset(skill);
  };

  const handleCancelEditSkill = () => {
    setEditingSkill(null);
    skillForm.reset();
  };

  const handleEditValue = (value: any) => {
    setEditingValue(value);
    valueForm.reset({
      title: value.title,
      description: value.description,
      icon: value.icon,
      order: value.order,
    });
  };

  const handleCancelEditValue = () => {
    setEditingValue(null);
    valueForm.reset();
  };

  const stats = [
    {
      title: "Articles",
      value: articles.length,
      icon: <FileText className="text-blue-400 text-xl" />,
    },
    {
      title: "Skills",
      value: skills.length,
      icon: <Users className="text-green-400 text-xl" />,
    },
    {
      title: "Messages",
      value: messages.length,
      icon: <Mail className="text-blue-400 text-xl" />,
    },
    {
      title: "Activities",
      value: activities.length,
      icon: <BarChart3 className="text-green-400 text-xl" />,
    },
    {
      title: "Education",
      value: education.length,
      icon: <Archive className="text-blue-400 text-xl" />,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "React":
        return "bg-blue-500/20 text-blue-400";
      case "Node.js":
        return "bg-green-500/20 text-green-400";
      case "Cloud":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <>
      <AnimatedBlueBg />
    <div className="relative z-10 pt-24">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with logout button */}
          <div className="flex justify-center items-center mb-8 relative">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold gradient-text mb-6">Admin Dashboard</h1>
            </motion.div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/20 absolute right-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid md:grid-cols-5 gap-4 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-effect rounded-2xl p-4 text-center hover-glow transition-all duration-300 border-white/10">
                  <CardContent className="p-0">
                    <div className="mb-2">{stat.icon}</div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-6 glass-effect border-white/10">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="values">Values</TabsTrigger>
            </TabsList>

            {/* Articles Management */}
            <TabsContent value="articles">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Article Form */}
                <div className="lg:col-span-1">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-blue-400">
                        {editingArticle ? "Edit Article" : "Add Article"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Form {...articleForm}>
                        <form onSubmit={articleForm.handleSubmit(onSubmitArticle)} className="space-y-4">
                          <FormField
                            control={articleForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Article title"
                                    className="bg-slate-800 border-gray-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={articleForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Category</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. React, Node.js"
                                    className="bg-slate-800 border-gray-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={articleForm.control}
                            name="excerpt"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Excerpt</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Brief description"
                                    className="bg-slate-800 border-gray-600 text-white"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={articleForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Image</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id="article-image-upload"
                                      style={{ display: 'none' }}
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const formData = new FormData();
                                          formData.append('image', file);
                                          const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData,
                                          });
                                          const data = await res.json();
                                          if (data.imageUrl) {
                                            field.onChange(data.imageUrl);
                                          }
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                                      onClick={() => document.getElementById('article-image-upload')?.click()}
                                    >
                                      Choose File
                                    </Button>
                                    {field.value && (
                                      <div className="w-16 h-16 rounded overflow-hidden border-2 border-gray-600">
                                        <img
                                          src={field.value}
                                          alt="Article preview"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={articleForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Content</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Full article content"
                                    className="bg-slate-800 border-gray-600 text-white"
                                    rows={6}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                              disabled={createArticleMutation.isPending || updateArticleMutation.isPending}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {editingArticle ? "Update" : "Create"}
                            </Button>
                            {editingArticle && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="border-white/20 text-white"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>

                {/* Articles List */}
                <div className="lg:col-span-2">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-green-400">Manage Articles</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        {articles.map((article) => (
                          <div key={article.id} className="glass-effect p-4 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${getCategoryColor(article.category)} border-0`}>
                                    {article.category}
                                  </Badge>
                                  <Badge className={article.published ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                                    {article.published ? "Published" : "Draft"}
                                  </Badge>
                                </div>
                                <p className="text-gray-300 text-sm">{article.excerpt}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditArticle(article)}
                                  className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteArticleMutation.mutate(article.id)}
                                  className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Skills Management */}
            <TabsContent value="skills">
                <div className="mb-8">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-3xl font-bold text-blue-400">
                        {editingSkill ? "Edit Skill" : "Add Skill"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Form {...skillForm}>
                        <form onSubmit={skillForm.handleSubmit(onSubmitSkill)} className="space-y-4">
                          <FormField control={skillForm.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Name</FormLabel>
                              <FormControl>
                                <Input className="bg-slate-800 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={skillForm.control} name="category" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Category</FormLabel>
                              <FormControl>
                                <Input className="bg-slate-800 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={skillForm.control} name="percentage" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Percentage</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-slate-800 border-gray-600 text-white" {...field} value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={skillForm.control} name="icon" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Icon</FormLabel>
                              <FormControl>
                                <Input className="bg-slate-800 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={skillForm.control} name="order" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Order</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-slate-800 border-gray-600 text-white" {...field} value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                              {editingSkill ? "Update" : "Create"}
                            </Button>
                            {editingSkill && (
                              <Button type="button" variant="outline" onClick={handleCancelEditSkill} className="border-white/20 text-white">Cancel</Button>
                            )}
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              <Card className="glass-effect rounded-2xl p-8 border-white/10">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-semibold text-green-400">Manage Skills</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="glass-effect p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center">
                          <i className={`${skill.icon} text-2xl ${
                            skill.category === "Frontend" || skill.category === "Cloud" ? "text-blue-400" : "text-green-400"
                          } mr-3`}></i>
                          <div>
                            <div className="font-semibold text-white">{skill.name}</div>
                            <div className="text-sm text-gray-400">{skill.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`font-semibold ${
                            skill.percentage >= 80 ? "text-green-400" : "text-blue-400"
                          }`}>
                            {skill.percentage}%
                          </div>
                            <Button size="sm" variant="outline" className="border-blue-400/50 text-blue-400" onClick={() => handleEditSkill(skill)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                            <Button size="sm" variant="outline" className="border-red-400/50 text-red-400" onClick={() => deleteSkillMutation.mutate(skill.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Management */}
            <TabsContent value="profile">
              <Card className="glass-effect rounded-2xl p-8 border-white/10 max-w-2xl">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold text-blue-400">Profile Settings</CardTitle>
                    <Button
                      onClick={() => setEditingProfile(!editingProfile)}
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {editingProfile ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {editingProfile ? (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Name</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Phone</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Location</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="tagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Tagline</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Full Stack Developer & Tech Enthusiast"
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Profile Image</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-image-upload"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        const res = await fetch('/api/upload', {
                                          method: 'POST',
                                          body: formData,
                                        });
                                        const data = await res.json();
                                        if (data.imageUrl) {
                                          setProfileImagePreview(data.imageUrl);
                                          field.onChange(data.imageUrl);
                                        }
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                                  >
                                    Choose Photo
                                  </Button>
                                  {(profileImagePreview || field.value) && (
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                                      <img
                                        src={profileImagePreview || field.value}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={4}
                                  placeholder="Tell us about yourself..."
                                  className="bg-slate-800 border-gray-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                          
                          <FormField
                            control={profileForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Age</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="bg-slate-800 border-gray-600 text-white"
                                    {...field}
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Position</FormLabel>
                                <FormControl>
                                  <Input
                                    className="bg-slate-800 border-gray-600 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update Profile
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      {/* Profile Image */}
                      {profile?.imageUrl && (
                        <div>
                          <label className="text-sm font-medium text-gray-300">Profile Image</label>
                          <div className="mt-2">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600">
                              <img 
                                src={profile.imageUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300">Name</label>
                        <div className="text-white">{profile?.name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <div className="text-white">{profile?.email}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Phone</label>
                        <div className="text-white">{profile?.phone}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Location</label>
                        <div className="text-white">{profile?.location}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Tagline</label>
                        <div className="text-blue-400 font-medium">{profile?.tagline}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Bio</label>
                        <div className="text-white">{profile?.bio}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages">
              <Card className="glass-effect rounded-2xl p-8 border-white/10">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl font-semibold text-blue-400">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {!Array.isArray(messages) || messages.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No messages yet.</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="glass-effect p-4 rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{message.name}</h3>
                              <p className="text-sm text-blue-400">{message.email}</p>
                            </div>
                              <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-400">
                              {new Date(message.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                                <Button size="sm" variant="outline" className="border-red-400/50 text-red-400 hover:bg-red-400/10 ml-2" onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this message?')) {
                                    deleteMessageMutation.mutate(message.id);
                                  }
                                }}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                          </div>
                          <h4 className="font-medium text-green-400 mb-2">{message.subject}</h4>
                          <p className="text-gray-300 text-sm">{message.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Management */}
            <TabsContent value="activities">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-blue-400">{editingActivity ? "Edit Activity" : "Add Activity"}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Form {...activityForm}>
                        <form onSubmit={activityForm.handleSubmit(onSubmitActivity)} className="space-y-4">
                          <FormField control={activityForm.control} name="title" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Title</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={activityForm.control} name="description" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Description</FormLabel>
                              <FormControl><Textarea className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={activityForm.control} name="icon" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Icon</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={activityForm.control} name="order" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Order</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-slate-800 border-gray-600 text-white" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">{editingActivity ? "Update" : "Create"}</Button>
                            {editingActivity && <Button type="button" variant="outline" onClick={handleCancelEditActivity} className="border-white/20 text-white">Cancel</Button>}
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-green-400">Manage Activities</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="glass-effect p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-2">{activity.title}</h3>
                                <div className="text-sm text-gray-400 mb-2">{activity.description}</div>
                                <span className="text-xs text-blue-400">{activity.icon}</span>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => handleEditActivity(activity)} className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"><Edit className="w-4 h-4" /></Button>
                                <Button size="sm" variant="outline" onClick={() => deleteActivityMutation.mutate(activity.id)} className="border-red-400/50 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Education Management */}
            <TabsContent value="education">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-blue-400">{editingEducation ? "Edit Education" : "Add Education"}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Form {...educationForm}>
                        <form onSubmit={educationForm.handleSubmit(onSubmitEducation)} className="space-y-4">
                          <FormField control={educationForm.control} name="degree" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Degree</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={educationForm.control} name="institution" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Institution</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={educationForm.control} name="description" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Description</FormLabel>
                              <FormControl><Textarea className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={educationForm.control} name="startDate" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Start Date</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={educationForm.control} name="endDate" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">End Date</FormLabel>
                              <FormControl><Input className="bg-slate-800 border-gray-600 text-white" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={educationForm.control} name="order" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Order</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-slate-800 border-gray-600 text-white" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">{editingEducation ? "Update" : "Create"}</Button>
                            {editingEducation && <Button type="button" variant="outline" onClick={handleCancelEditEducation} className="border-white/20 text-white">Cancel</Button>}
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  <Card className="glass-effect rounded-2xl p-8 border-white/10">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-green-400">Manage Education</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        {education.map((edu) => (
                          <div key={edu.id} className="glass-effect p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-2">{edu.degree}</h3>
                                <div className="text-sm text-gray-400 mb-2">{edu.institution}</div>
                                <div className="text-xs text-blue-400 mb-2">{edu.startDate} - {edu.endDate}</div>
                                <span className="text-xs text-gray-400">{edu.description}</span>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => handleEditEducation(edu)} className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"><Edit className="w-4 h-4" /></Button>
                                <Button size="sm" variant="outline" onClick={() => deleteEducationMutation.mutate(edu.id)} className="border-red-400/50 text-red-400 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

              {/* Values Management */}
              <TabsContent value="values">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Value Form */}
                  <div className="lg:col-span-1">
                    <Card className="glass-effect rounded-2xl p-8 border-white/10">
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-2xl font-semibold text-blue-400">
                          {editingValue ? "Edit Value" : "Add Value"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Form {...valueForm}>
                          <form onSubmit={valueForm.handleSubmit(onSubmitValue)} className="space-y-4">
                            <FormField
                              control={valueForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Title</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Value title"
                                      className="bg-slate-800 border-gray-600 text-white"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={valueForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Value description"
                                      className="bg-slate-800 border-gray-600 text-white"
                                      rows={3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={valueForm.control}
                              name="icon"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Icon (FontAwesome class)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. fas fa-lightbulb"
                                      className="bg-slate-800 border-gray-600 text-white"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={valueForm.control}
                              name="order"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Order</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Order"
                                      className="bg-slate-800 border-gray-600 text-white"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex gap-2">
                              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                {editingValue ? "Update" : "Add"}
                              </Button>
                              {editingValue && (
                                <Button type="button" variant="outline" onClick={handleCancelEditValue} className="border-white/20 text-white">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Value List */}
                  <div className="lg:col-span-2">
                    <div className="grid gap-4">
                      {Array.isArray(values) && values.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((value) => (
                        <Card key={value.id} className="glass-effect rounded-2xl p-6 flex items-center justify-between border-white/10">
                          <div>
                            <div className="font-bold text-lg text-white mb-1">{value.title}</div>
                            <div className="text-gray-300 text-sm mb-2">{value.description}</div>
                            <div className="text-xs text-slate-400">Icon: {value.icon}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditValue(value)} className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteValueMutation.mutate(value.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
    </>
  );
}
