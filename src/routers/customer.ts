import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';

export const router = express.Router();

router.get('/', getCustomer);
router.post('/', saveCustomer);
router.put('/:lineId', updateCustomer);

export async function getCustomer(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let criteria = {};
    let db = di.get('db');
    let collection = db.collection('customers');
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

export async function saveCustomer(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('digital_partners');
    body.registed_at = new Date();
    let dp = await collection.insertOne(body);
    response = resp({ id: dp.insertedId }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function updateCustomer(req, res, next) {
  let response = undefined;
  try {
    let db = di.get('db');
    let collection = db.collection('customers');
    let update = await collection.updateOne(
      { // _id 
      },
      {
        //$set: property  to update,
      }
    );
    if (update) {
      response = resp({ message: 'SUCCESS' }, 200);
    } else {
      throw new Error('UNSUCCESS');
    }
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}
