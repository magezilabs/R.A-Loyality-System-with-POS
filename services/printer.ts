import type { ReceiptPayload } from '../utils/types';

/**
 * This service handles receipt printing using a connected printer API.
 * It's designed to format approved order data and send it to a printer device.
 * 
 * You can replace the actual printing logic depending on your hardware (Bluetooth, USB, network, cloud).
 */

export const printReceipt = async (payload: ReceiptPayload) => {
  try {
    const { id, items, totalAmount, createdAt } = payload;

    let receipt = `\n🧾 Order Receipt\n--------------------------\n`;
    receipt += `Order ID: ${id}\n`;
    receipt += `Date: ${new Date(createdAt).toLocaleString()}\n\n`;

    receipt += `Items:\n`;
    items.forEach(item => {
      receipt += `- ${item.name} x${item.quantity} @ ${item.price} UGX\n`;
    });

    receipt += `\n--------------------------\n`;
    receipt += `Total: ${totalAmount} UGX\n`;
    receipt += `\nThank you!\n\n`;

    // Replace with actual printer integration
    console.log(receipt);
  } catch (error) {
    console.error('Print failed:', error);
  }
};
