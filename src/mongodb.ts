import { MongoClient } from 'mongodb';
import { config } from './config';

class MongoDB {
  async connect() {
    const host = config.mongodb.host;
    const port = config.mongodb.port;
    const username = config.mongodb.username;
    const password = config.mongodb.password;
    const database = config.mongodb.database;
    const qs = config.mongodb.qs;

    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}${qs}`;

    let promise = new Promise((resolve, reject) => {
      MongoClient.connect(uri, (err, connection) => {
        if (err) {
          reject(err);
        }
        resolve(connection);
      });
    });

    return promise;
  }
}

export const mongodb = new MongoDB();
