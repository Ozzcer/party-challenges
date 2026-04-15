export type User =
  | {
      id: number;
      name: string;
      role: 'admin';
    }
  | {
      id: number;
      name: string;
      role: 'player';
      playerCode: number;
    };
