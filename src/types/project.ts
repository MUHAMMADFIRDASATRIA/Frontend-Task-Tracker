// src/types/project.ts

export interface Project {
  id: number | string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other fields as needed
}

export interface ProjectWithRole extends Project {
  role?: 'leader' | 'member';
}
