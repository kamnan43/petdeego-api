import { OrderManager } from './OrderManager';
import { QuotationManager } from './QuotationManager';
import { DriverManager } from './DriverManager';
export const manager = {
  order: new OrderManager(),
  quotation: new QuotationManager(),
  driver: new DriverManager()
};
