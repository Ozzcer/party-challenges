export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export type UserRole = 'player' | 'admin';