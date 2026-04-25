export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UpsertCategory {
  name: string;
  description?: string;
}

