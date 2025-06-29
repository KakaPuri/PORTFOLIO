import {
  users, articles, skills, experiences, education, activities, values, profile, messages,
  type User, type InsertUser, type Article, type InsertArticle,
  type Skill, type InsertSkill, type Experience, type InsertExperience,
  type Education, type InsertEducation, type Activity, type InsertActivity,
  type Value, type InsertValue, type Profile, type InsertProfile, type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Article methods
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // Skill methods
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Experience methods
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;

  // Education methods
  getEducation(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;

  // Activity methods
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;

  // Value methods
  getValues(): Promise<Value[]>;
  createValue(value: InsertValue): Promise<Value>;
  updateValue(id: number, value: Partial<InsertValue>): Promise<Value | undefined>;
  deleteValue(id: number): Promise<boolean>;

  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profileData: InsertProfile): Promise<Profile>;

  // Message methods
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteMessage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    return { ...user, id: result.insertId };
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(articles.id);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article);
    return { ...article, id: result.insertId };
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const result = await db.update(articles).set(article).where(eq(articles.id, id));
    if (result.affectedRows === 0) return undefined;
    return await this.getArticle(id);
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.affectedRows > 0;
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill);
    return { ...skill, id: result.insertId };
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db.update(skills).set(skill).where(eq(skills.id, id));
    if (result.affectedRows === 0) return undefined;
    return await db.select().from(skills).where(eq(skills.id, id)).limit(1).then(r => r[0]);
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return result.affectedRows > 0;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(experiences.order);
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(experience);
    return { ...experience, id: result.insertId };
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const result = await db.update(experiences).set(experience).where(eq(experiences.id, id));
    if (result.affectedRows === 0) return undefined;
    return await db.select().from(experiences).where(eq(experiences.id, id)).limit(1).then(r => r[0]);
  }

  async deleteExperience(id: number): Promise<boolean> {
    const result = await db.delete(experiences).where(eq(experiences.id, id));
    return result.affectedRows > 0;
  }

  // Education methods
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education).orderBy(education.order);
  }

  async createEducation(educationData: InsertEducation): Promise<Education> {
    const result = await db.insert(education).values(educationData);
    return { ...educationData, id: result.insertId };
  }

  async updateEducation(id: number, educationData: Partial<InsertEducation>): Promise<Education | undefined> {
    const result = await db.update(education).set(educationData).where(eq(education.id, id));
    if (result.affectedRows === 0) return undefined;
    return await db.select().from(education).where(eq(education.id, id)).limit(1).then(r => r[0]);
  }

  async deleteEducation(id: number): Promise<boolean> {
    const result = await db.delete(education).where(eq(education.id, id));
    return result.affectedRows > 0;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(activities.order);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity);
    return { ...activity, id: result.insertId };
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined> {
    const result = await db.update(activities).set(activity).where(eq(activities.id, id));
    if (result.affectedRows === 0) return undefined;
    return await db.select().from(activities).where(eq(activities.id, id)).limit(1).then(r => r[0]);
  }

  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return result.affectedRows > 0;
  }

  // Value methods
  async getValues(): Promise<Value[]> {
    return await db.select().from(values).orderBy(values.order);
  }

  async createValue(value: InsertValue): Promise<Value> {
    const result = await db.insert(values).values(value);
    return { ...value, id: result.insertId };
  }

  async updateValue(id: number, value: Partial<InsertValue>): Promise<Value | undefined> {
    const result = await db.update(values).set(value).where(eq(values.id, id));
    if (result.affectedRows === 0) return undefined;
    return await db.select().from(values).where(eq(values.id, id)).limit(1).then(r => r[0]);
  }

  async deleteValue(id: number): Promise<boolean> {
    const result = await db.delete(values).where(eq(values.id, id));
    return result.affectedRows > 0;
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    const result = await db.select().from(profile).limit(1);
    return result[0];
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      await db.update(profile).set(profileData).where(eq(profile.id, existing.id));
      return { ...existing, ...profileData };
    } else {
      const result = await db.insert(profile).values(profileData);
      return { ...profileData, id: result.insertId };
    }
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message);
    return { ...message, id: result.insertId };
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await db.update(messages).set({ read: true }).where(eq(messages.id, id));
    return result.affectedRows > 0;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return result.affectedRows > 0;
  }
}

export const storage = new DatabaseStorage();

// Function to seed database with initial data
export async function seedDatabase() {
  try {
    // Check if profile exists, if not create initial data
    const existingProfile = await storage.getProfile();
    if (!existingProfile) {
      console.log("Seeding database with initial data...");
      
      // Create initial profile
      await storage.updateProfile({
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+62 812-3456-7890",
      location: "Jakarta, Indonesia",
        age: 22,
        position: "Full Stack Developer",
      tagline: "Full Stack Developer & Tech Enthusiast",
      bio: "Seorang Full Stack Developer dengan pengalaman 5+ tahun dalam mengembangkan aplikasi web dan mobile. Passionate dalam teknologi terbaru dan selalu siap untuk tantangan baru.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      });

      // Create initial skills
    const skillsData = [
      { name: "React.js", category: "Frontend", percentage: 90, icon: "fab fa-react", order: 1 },
      { name: "Node.js", category: "Backend", percentage: 85, icon: "fab fa-node-js", order: 2 },
      { name: "Python", category: "Backend", percentage: 80, icon: "fab fa-python", order: 3 },
      { name: "MongoDB", category: "Database", percentage: 75, icon: "fas fa-database", order: 4 },
      { name: "Docker", category: "DevOps", percentage: 70, icon: "fab fa-docker", order: 5 },
      { name: "AWS", category: "Cloud", percentage: 75, icon: "fab fa-aws", order: 6 },
    ];
      for (const skill of skillsData) {
        await storage.createSkill(skill);
      }

      // Create initial experiences
    const experiencesData = [
      {
        title: "Senior Full Stack Developer",
        company: "Tech Company Inc.",
        description: "Leading development of enterprise web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting scalable solutions.",
        startDate: "2021",
        endDate: null,
        current: true,
        order: 1,
      },
      {
        title: "Frontend Developer",
        company: "Digital Agency",
        description: "Developed responsive web applications and collaborated with design teams to create engaging user experiences using modern frontend technologies.",
        startDate: "2019",
        endDate: "2021",
        current: false,
        order: 2,
      },
      ];
      for (const exp of experiencesData) {
        await storage.createExperience(exp);
      }

      // Create initial education
    const educationData = [
      {
        degree: "Bachelor of Computer Science",
        institution: "University of Technology",
        description: "Focused on software engineering and web development with honors degree. Active in programming competitions and tech communities.",
        startDate: "2014",
        endDate: "2018",
        order: 1,
      },
      ];
      for (const edu of educationData) {
        await storage.createEducation(edu);
      }

      // Create initial activities
    const activitiesData = [
      {
        title: "Hackathon Winner",
        description: "First place in National Tech Hackathon 2022",
        icon: "fas fa-trophy",
        order: 1,
      },
      {
        title: "Community Leader",
        description: "Leading local developer community with 500+ members",
        icon: "fas fa-users",
        order: 2,
      },
      ];
      for (const activity of activitiesData) {
        await storage.createActivity(activity);
      }

      // Create initial values
      const valuesData = [
        {
          title: "Innovation",
          description: "Always seeking creative solutions and staying updated with latest technologies",
          icon: "fas fa-lightbulb",
          order: 1,
        },
        {
          title: "Collaboration",
          description: "Building strong relationships and working effectively in teams",
          icon: "fas fa-handshake",
        order: 2,
      },
      {
          title: "Quality",
          description: "Committed to delivering high-quality, maintainable code",
          icon: "fas fa-star",
        order: 3,
      },
    ];
      for (const value of valuesData) {
        await storage.createValue(value);
      }

      // Create initial articles
    const articlesData = [
      {
        title: "Membangun Modern Web App dengan React",
        content: "Tutorial lengkap menggunakan React Hooks dan modern best practices untuk development aplikasi web yang performant...",
        excerpt: "Tutorial lengkap menggunakan React Hooks dan modern best practices untuk development aplikasi web yang performant.",
        category: "React",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
      },
      {
        title: "Optimasi Performance Node.js Backend",
        content: "Tips dan trik untuk meningkatkan performance aplikasi backend Node.js dengan caching dan database optimization...",
        excerpt: "Tips dan trik untuk meningkatkan performance aplikasi backend Node.js dengan caching dan database optimization.",
        category: "Node.js",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
      },
      ];
      for (const article of articlesData) {
        await storage.createArticle(article);
      }
      
      console.log("Database seeded successfully!");
    } else {
      console.log("Database already has data, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
