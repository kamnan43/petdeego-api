import * as express from 'express';
import { resp } from '../utils/resp';
import { di } from '../di';

export const router = express.Router();

router.get('/', getUser);
router.post('/:lineId', saveUser);
// router.put('/:lineId', updateUser);

export async function getUser(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let criteria = {};
    let db = di.get('db');
    let collection = db.collection('users');
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

export async function saveUser(req, res, next) {
  let response = undefined;
  try {
    let { body, params } = req;
    console.log('params', params);
    console.log('body', body);
    let db = di.get('db');
    let collection = db.collection('users');
    body.registed_at = new Date();
    let dp = await collection.update({ line_id: params.lineId }, { $set: body }, {
      upsert: true,
    });
    console.log('dp', dp);
    response = resp({ id: dp.insertedId }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}
/*
export async function updateUser(req, res, next) {
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
*/
