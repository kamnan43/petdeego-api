
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

  async getDriverByUserId(driverUserId): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.findOne({ user_id: driverUserId });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDriverById(driverId): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.findOne({ _id: ObjectId(driverId) });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateDriver(userId, data): Promise<any> {
    try {
      let db = di.get('db');
      let collection = db.collection('drivers');
      let update = await collection.updateOne(
        { 'user_id': userId }, {$set: data}
      );
      return update;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDriversByCriteria(criteria = {}) {
    try {
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.find(criteria).toArray();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDriversByOrderCriteria(order, criteria: any = {}) {
    try {
      let db = di.get('db');
      if (order.type_dog) criteria.isDog = true;
      if (order.type_cat) criteria.isCat = true;
      let collection = db.collection('drivers');
      const data = await collection.find(criteria).toArray();
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
