import { makeSensorsDao, SensorsDao } from '../lib/sensors-dao.js';

import { assert, expect } from 'chai';

import { MongoMemoryServer } from 'mongodb-memory-server';

interface WrappedDao {
  mongod: MongoMemoryServer;
};

export default class MemDao {

  static async setup() : Promise<SensorsDao> {
    const mongod = await MongoMemoryServer.create();
    assert(mongod.instanceInfo, `mongo memory server startup failed`);
    const uri = mongod.getUri();
    const daoResult = await makeSensorsDao(uri);
    assert(daoResult.isOk === true);
    const dao = daoResult.val;
    ((dao as unknown) as WrappedDao).mongod = mongod;
    return dao;
  }

  static async tearDown(dao: SensorsDao) {
    await dao.close();
    const mongod = ((dao as unknown) as WrappedDao).mongod;
    await mongod.stop();
    assert(mongod.instanceInfo === undefined,
	   `mongo memory server stop failed`);
  }
}


