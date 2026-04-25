/**
 * Basic interface for Article (Read-only / Reader-view) */
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt: string | null;

  authorName: string;
  categoryName: string;
}

/**
 * Interface for create/update articles
 * Only UI fields
 */
export interface UpsertArticle {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  publishNow: boolean;
}
