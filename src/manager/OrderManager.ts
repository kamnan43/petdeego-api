
import { di } from '../di';
const { ObjectId } = require('mongodb');
export class OrderManager {
  async updateOrderStatus(_id, status): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('orders');
      let update = await collection.updateOne(
        { '_id': ObjectId(_id) },
        {
          $set: { 'status': status }
        }
      );
      return update;
    } catch (err) {
      throw new Error(err);
    }
  }
}