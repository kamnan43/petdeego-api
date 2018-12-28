import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';

export const router = express.Router();

router.get('/', getDriver);
router.post('/', createDriver);
router.put('/update', updateDriver);

export async function getDriver(req, res, next) {
    let response = undefined;
    try {
      let { body } = req;
      let criteria = {};
      let db = di.get('db');
      let collection = db.collection('drivers');
      const data = await collection.find(criteria).sort().toArray();
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
      response = resp({ id: dp.insertedId }, 200);
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
