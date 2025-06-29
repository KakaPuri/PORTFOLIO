import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Briefcase, Code, Trophy, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { SkillBar } from "@/components/skill-bar";
import { Timeline } from "@/components/timeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedBlueBg from "@/components/animated-background";
import { useState } from "react";

export default function Home() {
  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: api.getProfile,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: api.getSkills,
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ["/api/experiences"],
    queryFn: api.getExperiences,
  });

  const { data: education = [] } = useQuery({
    queryKey: ["/api/education"],
    queryFn: api.getEducation,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: api.getActivities,
  });

  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatedBlueBg />
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Halo, I am <span className="gradient-text">Developer</span> & <span className="gradient-text">Designer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {profile.bio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-full text-white font-semibold hover-glow transition-all duration-300">
                  Contact Me
                </Button>
              </Link>
              <Link href="/articles">
                <Button variant="outline" className="px-8 py-4 glass-effect rounded-full text-white font-semibold hover-glow transition-all duration-300 border-white/20">
                  View My Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass-effect rounded-3xl p-8 md:p-12 hover-glow transition-all duration-300 border-white/10">
              <CardContent className="p-0">
                  <h2 className="text-4xl font-bold gradient-text mb-8 text-center">About Me</h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">{profile.name}</h3>
                      <div className="flex flex-wrap gap-6 mb-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="text-blue-400 w-5 h-5" />
                          <span>Age: <span className="font-semibold text-white">{profile.age}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Briefcase className="text-green-400 w-5 h-5" />
                          <span>Position: <span className="font-semibold text-white">{profile.position}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Code className="text-blue-400 w-5 h-5" />
                          <span>Location: <span className="font-semibold text-white">{profile.location}</span></span>
                      </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                  </div>
                  <div className="flex justify-center">
                      <div className="w-48 h-48 glass-effect rounded-full flex items-center justify-center overflow-hidden">
                      {profile.imageUrl ? (
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-8xl text-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold gradient-text mb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Skills & Expertise
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="glass-effect rounded-2xl p-8 border-white/10">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold text-blue-400 mb-6">Technical Skills</h3>
                  <div className="space-y-6">
                      {skills.map((skill, index) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        percentage={skill.percentage}
                        category={skill.category}
                        delay={index * 200}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="glass-effect rounded-2xl p-8 border-white/10">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold text-green-400 mb-6">Tools & Technologies</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        className="glass-effect p-4 rounded-xl text-center hover-glow transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSkill(skill)}
                      >
                        <i className={`${skill.icon} text-3xl mb-2 ${
                          skill.category === "Frontend" || skill.category === "Cloud" ? "text-blue-400" : "text-green-400"
                        }`}></i>
                        <div className="text-sm text-gray-300">{skill.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold gradient-text mb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Experience
          </motion.h2>
          <Timeline items={experiences} type="experience" />
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold gradient-text mb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Education
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-effect rounded-2xl p-8 hover-glow transition-all duration-300 border-white/10">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                        <Code className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                        <p className="text-green-400">{edu.institution}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-3">{edu.startDate} - {edu.endDate}</p>
                    <p className="text-gray-300">{edu.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold gradient-text mb-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Activities & Achievements
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-effect rounded-2xl p-6 text-center hover-glow transition-all duration-300 cursor-pointer border-white/10">
                  <CardContent className="p-0">
                    <i className={`${activity.icon} text-4xl mb-4 ${
                      index % 2 === 0 ? "text-blue-400" : "text-green-400"
                    }`}></i>
                    <h3 className="text-xl font-semibold mb-3 text-white">{activity.title}</h3>
                    <p className="text-gray-300">{activity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Modal Skill Detail */}
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedSkill(null)}>
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[90vw] relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl" onClick={() => setSelectedSkill(null)}>&times;</button>
              <div className="flex flex-col items-center gap-4">
                <i className={`${selectedSkill.icon} text-5xl ${selectedSkill.category === "Frontend" || selectedSkill.category === "Cloud" ? "text-blue-400" : "text-green-400"}`}></i>
                <div className="text-2xl font-bold text-white">{selectedSkill.name}</div>
                <div className="text-sm text-slate-400 mb-2">{selectedSkill.category}</div>
                <div className="w-full flex items-center gap-2">
                  <span className="text-blue-400 font-semibold">{selectedSkill.percentage}%</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${selectedSkill.percentage}%` }}></div>
                  </div>
                </div>
                {selectedSkill.description && (
                  <div className="text-gray-300 text-center mt-2">{selectedSkill.description}</div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
    </>
  );
}
