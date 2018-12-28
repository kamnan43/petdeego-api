import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';
import { manager } from '../manager/manager';

export const router = express.Router();

router.get('/', getDriver);
router.get('/:userid', getDriverByUserId);
router.post('/', createDriver);
router.put('/update', updateDriver);

export async function getDriver(req, res, next) {
    let response = undefined;
    try {
      const data = await manager.driver.getDrivers();
      if (data) {
        response = resp(data);
      } else {
        throw new Error('DATA_NOT_FOUND');
      }
    } catch (err) {
      console.log('err', err);
      response = resp({ message: err.message }, 400);
    }
    next(response);
}

export async function getDriverByUserId(req, res, next) {
    let response = undefined;
    try {
      let { body } = req;
      let { userid, orderid } = req.params;
      let criteria = {
        'user_id': userid,
      };
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.findOne(criteria);
      if (data) {
        response = resp(data);
      } else {
        throw new Error('DATA_NOT_FOUND');
      }
    } catch (err) {
      console.log('err', err);
      response = resp({ message: err.message }, 400);
    }
    next(response);
  }

export async function createDriver(req, res, next) {
    let response = undefined;
    try {
      let { body } = req;
      let db = di.get('db');
      let collection = db.collection('drivers');
      body.registed_at = new Date();
      let dp = await collection.insertOne(body);
      response = resp({ id: dp.insertedId, user_id: body.user_id }, 200);
    } catch (err) {
      console.log('err', err);
      response = resp({ message: err.message }, 400);
    }
    next(response);
  }

  export async function updateDriver(req, res, next) {
    let response = undefined;
    try {

    } catch (err) {
      console.log('err', err);
      response = resp({ message: err.message }, 400);
    }
    next(response);
  }
