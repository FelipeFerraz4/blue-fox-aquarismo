import { Post } from "./post";

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface CategoryWithPost extends Category {
    post: Post;
}
