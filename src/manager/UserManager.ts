
import { di } from '../di';
export class UserManager {
  async getUser(criteria = {}): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('users');
      let data = await collection.findOne(criteria);
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getUsers(criteria = {}): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('users');
      let data = await collection.findOne(criteria).toArray();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
