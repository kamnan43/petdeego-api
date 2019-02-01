import { di } from '../di';
const { ObjectId } = require('mongodb');

export class CustomerManager {
  async getCustomers(): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('customers');
      const data = await collection.find({}).sort().toArray();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCustomerByUserId(userId): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('customers');
      const data = await collection.findOne({ user_id: userId });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCustomerById(id): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('customers');
      const data = await collection.findOne({ _id: ObjectId(id) });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateCustomerByLineUserId(userId, data): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('customers');
      let update = await collection.updateOne(
        { 'user_id': userId }, {$set: data}
      );
      return update;
    } catch (err) {
      throw new Error(err);
    }
  }
}
