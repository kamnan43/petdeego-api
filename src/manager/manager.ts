import { OrderManager } from './OrderManager';
import { QuotationManager } from './QuotationManager';
export const manager = {
  order: new OrderManager(),
  quotation: new QuotationManager()
};
