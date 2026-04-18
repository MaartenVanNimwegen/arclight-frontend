import client from "../api/client";
import type { Article } from "../types/article";

export interface CreateArticleDto {
  title: string;
  summary: string;
  content: string;
  categoryId: number;
}

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await client.get<Article[]>("/articles");
    return response.data;
  },

  create: async (articleData: CreateArticleDto): Promise<Article> => {
    const response = await client.post<Article>("/articles", articleData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/articles/${id}`);
  },
};
