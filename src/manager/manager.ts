import { OrderManager } from './OrderManager';
import { QuotationManager } from './QuotationManager';
import { DriverManager } from './DriverManager';
import { UserManager } from './UserManager';
import { CustomerManager } from './CustomerManager';

export const manager = {
  order: new OrderManager(),
  quotation: new QuotationManager(),
  driver: new DriverManager(),
  user: new UserManager(),
  customer: new CustomerManager(),
};
