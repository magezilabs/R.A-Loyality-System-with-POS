// Menu Item
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  is_available: number;
}

// Order
export interface Order {
  id: string;
  customer_id?: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'declined' | 'submitted';
  is_synced: number;
  created_at: number;
  decline_reason?: string;
}

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  name?: string;
}

// Customer
export interface Customer {
  id: string;
  phone: string;
  points: number;
  email?: string;
  is_anonymous?: number;
  created_at?: number;
}

// Staff
export interface Staff {
  id: string;
  name: string;
  pin: string;
  role: 'admin' | 'staff';
}

// Receipt
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}
export interface ReceiptPayload {
  id: string;
  items: ReceiptItem[];
  totalAmount: number;
  createdAt: number;
}

// Loyalty
export type LoyaltyStatus = {
  status: 'verified' | 'anonymous' | 'new_client';
  points: number;
  redeemed: any[];
} | null;

// App Settings
export interface AppSettings {
  autoBackupEnabled: boolean;
}
