import { OrderManager } from './OrderManager';
import { QuotationManager } from './QuotationManager';
import { DriverManager } from './driverManager';
export const manager = {
  order: new OrderManager(),
  quotation: new QuotationManager(),
  driver: new DriverManager()
};
