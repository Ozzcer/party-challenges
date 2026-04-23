export type User =
  | {
      id: number;
      name: string;
      role: 'admin';
    }
  | {
      id: number;
      name: string | null;
      role: 'player';
      playerCode: string;
    };
