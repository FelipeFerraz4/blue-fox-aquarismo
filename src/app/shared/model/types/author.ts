import { Status } from './status';

export interface Author {
  id: string;
  name: string;
  bio?: string;
  profilePictureUrl?: string;
  slug: string;
  email: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}