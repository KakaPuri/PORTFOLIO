import { apiRequest } from "./queryClient";
import type { 
  Article, InsertArticle, Skill, InsertSkill, 
  Experience, Education, Activity, Value, InsertValue, Profile, InsertProfile,
  Message, InsertMessage 
} from "@shared/schema";

export const api = {
  // Profile
  getProfile: () => fetch("/api/profile").then(res => res.json()) as Promise<Profile>,
  updateProfile: (data: InsertProfile) => apiRequest("PUT", "/api/profile", data),

  // Articles
  getArticles: () => fetch("/api/articles").then(res => res.json()) as Promise<Article[]>,
  getArticle: (id: number) => fetch(`/api/articles/${id}`).then(res => res.json()) as Promise<Article>,
  createArticle: (data: InsertArticle) => apiRequest("POST", "/api/articles", data),
  updateArticle: (id: number, data: Partial<InsertArticle>) => apiRequest("PUT", `/api/articles/${id}`, data),
  deleteArticle: (id: number) => apiRequest("DELETE", `/api/articles/${id}`),

  // Skills
  getSkills: () => fetch("/api/skills").then(res => res.json()) as Promise<Skill[]>,
  createSkill: (data: InsertSkill) => apiRequest("POST", "/api/skills", data),
  updateSkill: (id: number, data: Partial<InsertSkill>) => apiRequest("PUT", `/api/skills/${id}`, data),
  deleteSkill: (id: number) => apiRequest("DELETE", `/api/skills/${id}`),

  // Experiences
  getExperiences: () => fetch("/api/experiences").then(res => res.json()) as Promise<Experience[]>,
  createExperience: (data: any) => apiRequest("POST", "/api/experiences", data),
  updateExperience: (id: number, data: any) => apiRequest("PUT", `/api/experiences/${id}`, data),
  deleteExperience: (id: number) => apiRequest("DELETE", `/api/experiences/${id}`),

  // Education
  getEducation: () => fetch("/api/education").then(res => res.json()) as Promise<Education[]>,
  createEducation: (data: any) => apiRequest("POST", "/api/education", data),
  updateEducation: (id: number, data: any) => apiRequest("PUT", `/api/education/${id}`, data),
  deleteEducation: (id: number) => apiRequest("DELETE", `/api/education/${id}`),

  // Activities
  getActivities: () => fetch("/api/activities").then(res => res.json()) as Promise<Activity[]>,
  createActivity: (data: any) => apiRequest("POST", "/api/activities", data),
  updateActivity: (id: number, data: any) => apiRequest("PUT", `/api/activities/${id}`, data),
  deleteActivity: (id: number) => apiRequest("DELETE", `/api/activities/${id}`),

  // Values
  getValues: () => fetch("/api/values").then(res => res.json()) as Promise<Value[]>,
  createValue: (data: InsertValue) => apiRequest("POST", "/api/values", data),
  updateValue: (id: number, data: Partial<InsertValue>) => apiRequest("PUT", `/api/values/${id}`, data),
  deleteValue: (id: number) => apiRequest("DELETE", `/api/values/${id}`),

  // Messages
  getMessages: () => apiRequest("GET", "/api/messages").then(res => res.json()) as Promise<Message[]>,
  getMessagesByEmail: (email: string) => fetch(`/api/messages/sender/${encodeURIComponent(email)}`).then(res => res.json()) as Promise<Message[]>,
  createMessage: (data: InsertMessage) => apiRequest("POST", "/api/messages", data),
  markMessageAsRead: (id: number) => apiRequest("PUT", `/api/messages/${id}/read`),
  deleteMessage: (id: number) => apiRequest("DELETE", `/api/messages/${id}`).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.message || 'Failed to delete message');
      });
    }
    return res.json();
  }),
  deleteMessageBySender: (id: number, email: string) => apiRequest("DELETE", `/api/messages/${id}/sender`, { email }),
};
