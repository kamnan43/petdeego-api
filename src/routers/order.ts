import * as express from 'express';
import { di } from '../di';
import { resp } from '../utils/resp';

export const router = express.Router();

router.get('/', getOrder);
router.post('/', createOrder);

export async function getOrder(req, res, next) {
  let response = undefined;
  try {
    response = resp({ result: 'success' }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}

export async function createOrder(req, res, next) {
  let response = undefined;
  try {
    let { body } = req;
    let db = di.get('db');
    let collection = db.collection('orders');
    await collection.insertOne(body);
    response = resp({ result: 'success' }, 200);
  } catch (err) {
    console.log('err', err);
    response = resp({ message: err.message }, 400);
  }
  next(response);
}