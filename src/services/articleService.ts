import client from "../api/client";
import type { Article, UpsertArticle } from "../types/article";

const API_BASE_URL = "/articles";

export const articleService = {
  // Fetch all published articles from the API
  getAll: async (): Promise<Article[]> => {
    const response = await client.get<Article[]>(`${API_BASE_URL}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const response = await client.get<Article>(`${API_BASE_URL}/${slug}`);
    return response.data;
  },

  create: async (articleData: UpsertArticle): Promise<Article> => {
    const response = await client.post<Article>(`${API_BASE_URL}`, articleData);
    return response.data;
  },
  
  update: async (id: string, articleData: UpsertArticle): Promise<Article> => {
    const response = await client.put<Article>(`${API_BASE_URL}/${id}`, articleData);
    return response.data;
  },

  publish: async (id: string): Promise<void> => {
    await client.patch(`${API_BASE_URL}/${id}/publish`);
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`${API_BASE_URL}/${id}`);
  },

  getDrafts: async (): Promise<Article[]> => {
    const response = await client.get<Article[]>(`${API_BASE_URL}/drafts`);
    return response.data;
  },
};
