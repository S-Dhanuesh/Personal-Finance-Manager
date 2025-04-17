export interface Budget {
  id?: number;
  category: string;
  limit: number;
  month: string;
  //created_at: string; // Add this if it's part of your DB schema
}
