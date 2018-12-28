
import { di } from '../di';
const { ObjectId } = require('mongodb');
export class DriverManager {
  async getDrivers(petType?): Promise<any> {
    try {
      let criteria = petType ? {pet_type: petType } : {};
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.find(criteria).sort().toArray();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDriverById(driverId): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.find({ _id: ObjectId(driverId) }).findOne();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
