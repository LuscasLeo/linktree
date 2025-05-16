// Define os tipos/interfaces para os links e usuários

export interface Link {
  id?: number;
  title: string | null;
  url: string;
  order_index: number;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  created_at?: Date;
}
