export interface User {
  id: number;
  name: string;
  role: 'player' | 'admin';
}