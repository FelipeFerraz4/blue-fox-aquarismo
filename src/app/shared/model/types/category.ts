import { Post } from "./post";
import { Status } from './status';

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryWithPost extends Category {
    post: Post;
}
