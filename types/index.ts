export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string | null;
  stock?: number | null;
  stock_quantity?: number | null;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock?: number | null;
  stockQuantity?: number | null;
}

export interface StockUpdate {
  id: string;
  newStock: number;
  fieldName: string;
}

