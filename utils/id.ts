import { v4 as uuidv4 } from 'uuid';

export function generateOrderId() {
  return `ord_${uuidv4()}`;
}

export function generateOrderItemId() {
  return `oi_${uuidv4()}`;
}
