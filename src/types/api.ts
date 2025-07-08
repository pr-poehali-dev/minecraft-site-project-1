export interface DLCProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  gameId: string;
  platform: string[];
  rating: number;
  reviewsCount: number;
  releaseDate: string;
  features: string[];
  systemRequirements: {
    minimum: string;
    recommended: string;
  };
  inStock: boolean;
  downloadSize: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  purchasedDLCs: string[];
  balance: number;
  createdAt: string;
}

export interface CartItem extends DLCProduct {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "failed";
  paymentMethod: string;
  createdAt: string;
  keys?: { [dlcId: string]: string };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
