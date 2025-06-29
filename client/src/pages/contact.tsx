import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Lightbulb, Handshake, Star, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import AnimatedBlueBg from "@/components/animated-background";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: api.getProfile,
  });

  const { data: values = [] } = useQuery({
    queryKey: ["/api/values"],
    queryFn: api.getValues,
  });

  const form = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: api.createMessage,
    onSuccess: async (response) => {
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "Gagal Mengirim",
        description: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createMessageMutation.mutate(data);
  };

  const socialMediaLinks = [
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin",
      color: "text-blue-400",
      href: "#",
    },
    {
      name: "GitHub",
      icon: "fab fa-github",
      color: "text-green-400",
      href: "#",
    },
    {
      name: "Twitter",
      icon: "fab fa-twitter",
      color: "text-blue-400",
      href: "#",
    },
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      color: "text-green-400",
      href: "#",
    },
  ];

  // Helper function to render icon based on icon string
  const renderIcon = (iconString: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "fas fa-lightbulb": <Lightbulb className="text-blue-400 text-xl" />,
      "fas fa-handshake": <Handshake className="text-green-400 text-xl" />,
      "fas fa-star": <Star className="text-blue-400 text-xl" />,
      "fas fa-dollar-sign": <DollarSign className="text-green-400 text-xl" />,
    };
    return iconMap[iconString] || <Lightbulb className="text-blue-400 text-xl" />;
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
            <h1 className="text-5xl font-bold gradient-text mb-6">Contact & About Me</h1>
            <p className="text-xl text-gray-300">Let's connect and collaborate together</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect rounded-2xl p-8 border-white/10">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-semibold text-blue-400 mb-6">Send Message</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your name"
                                className="bg-slate-800 border-gray-600 text-white focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                className="bg-slate-800 border-gray-600 text-white focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Subject"
                                className="bg-slate-800 border-gray-600 text-white focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={6}
                                placeholder="Write your message here..."
                                className="bg-slate-800 border-gray-600 text-white focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        disabled={createMessageMutation.isPending}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-xl text-white font-semibold hover-glow transition-all duration-300"
                      >
                        {createMessageMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Contact Info & Social Media */}
            <div className="space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-effect rounded-2xl p-8 border-white/10">
                  <CardContent className="p-0">
                    <h2 className="text-2xl font-semibold text-green-400 mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="text-blue-400 text-xl mr-4" />
                        <span className="text-gray-300">{profile?.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="text-green-400 text-xl mr-4" />
                        <span className="text-gray-300">{profile?.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="text-blue-400 text-xl mr-4" />
                        <span className="text-gray-300">{profile?.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-effect rounded-2xl p-8 border-white/10">
                  <CardContent className="p-0">
                    <h2 className="text-2xl font-semibold text-blue-400 mb-6">Social Media</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {socialMediaLinks.map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          className="glass-effect p-4 rounded-xl text-center hover-glow transition-all duration-300 group cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className={`${social.icon} text-3xl ${social.color} mb-2 group-hover:scale-110 transition-transform duration-300`}></i>
                          <div className="text-sm text-gray-300">{social.name}</div>
                        </motion.a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Values */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glass-effect rounded-2xl p-8 border-white/10">
                  <CardContent className="p-0">
                      <h2 className="text-2xl font-semibold text-green-400 mb-6">Values</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Array.isArray(values) && values.map((value, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="group bg-gradient-to-br from-blue-900/40 to-green-900/30 rounded-xl p-6 flex items-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-white/10"
                          >
                            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 shadow-md mr-6 group-hover:scale-110 transition-transform duration-300">
                              {renderIcon(value.icon)}
                            </div>
                          <div>
                              <h3 className="font-bold text-lg text-white mb-1 gradient-text">{value.title}</h3>
                              <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                          </div>
                          </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
