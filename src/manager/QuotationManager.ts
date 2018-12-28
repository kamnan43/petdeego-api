
import { di } from '../di';
const { ObjectId } = require('mongodb');
export class QuotationManager {
  async updateQuotationStatus(_id, status): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('quotations');
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

  async getQuotationByCriteria(criteria = {}) {
    try {
      let db = di.get('db');
      let collection = db.collection('quotations');
      const data = await collection.find(criteria).findOne();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
