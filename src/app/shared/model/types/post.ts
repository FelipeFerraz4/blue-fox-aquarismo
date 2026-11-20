import { Status } from './status';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  readingTime: string;  
  published: boolean;
  status: Status;
  publishedAt?: string;
  views: number;
  likes: number;
  recommendedPostIds: string[];
  
  authorId: string;      
  authorName: string;    
  categoryId: string;   
  categoryName: string;  

  /** Idioma em que título, descrição e categoria vieram (a API cai para pt-BR sem tradução). */
  locale?: string;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Aggregated structure required to assemble the article details screen
 */
export interface PostPageData {
  recommended: Post[];
  latest: Post[];
}