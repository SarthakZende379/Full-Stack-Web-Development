import { SensorType, Sensor, SensorReading,
	 SensorTypeSearch, SensorSearch, SensorReadingSearch,
       } from './validators.js';

import { Errors, } from 'cs544-js-utils';
import { DEFAULT_COUNT, DEFAULT_INDEX } from './params.js';

import * as mongo from 'mongodb';

/** All that this DAO should do is maintain a persistent data for sensors.
 *
 *  Most routines return an errResult with code set to 'DB' if
 *  a database error occurs.
 */

/** return a DAO for sensors at URL mongodbUrl */
export async function
makeSensorsDao(mongodbUrl: string) : Promise<Errors.Result<SensorsDao>> {
  return SensorsDao.make(mongodbUrl);
}

//the types stored within collections
type DbSensorType = SensorType & { _id: string };
type DbSensor = Sensor & { _id: string };

//options for new MongoClient()
const MONGO_OPTIONS = {
  ignoreUndefined: true,  //ignore undefined fields in queries
};

export class SensorsDao {

  
  private constructor(
    private readonly client: mongo.MongoClient,
    private readonly sensorTypes: mongo.Collection<DbSensorType>,
    private readonly sensors: mongo.Collection<DbSensor>,
    private readonly sensorReadings: mongo.Collection<SensorReading>) {
  }

  /** factory method
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  static async make(dbUrl: string) : Promise<Errors.Result<SensorsDao>> {
    //takes care of all async ops, then call constructor
    try {
      const client =
	await (new mongo.MongoClient(dbUrl, MONGO_OPTIONS)).connect();;
      const db = client.db();

      const sensorTypes = db.collection<DbSensorType>('sensorTypes');
      //await sensorTypes.createIndex('id', {unique: true});
      await sensorTypes.createIndex('manufacturer');
      await sensorTypes.createIndex('modelNumber');
      await sensorTypes.createIndex('quantity');
      await sensorTypes.createIndex('unit');

      const sensors = db.collection<DbSensor>('sensors');
      //await sensors.createIndex('id', {unique: true});
      await sensors.createIndex('sensorTypeId');
      
      const sensorReadings = db.collection<SensorReading>('sensorReadings');
      await sensorReadings.createIndex({ sensorId: 1, timestamp: 1 },
				       { unique: true });
      await sensorReadings.createIndex('sensorId');
      await sensorReadings.createIndex('timestamp');

      const dao = new SensorsDao(client, sensorTypes, sensors, sensorReadings);
      return Errors.okResult(dao);
    }
    catch (err) {
      const msg = `cannot connect to URL "${dbUrl}": ${err}`;
      return Errors.errResult(msg, 'DB');
    }
  }

  /** Release all resources held by this dao.
   *  Specifically, close any database connections.
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async close() : Promise<Errors.Result<void>> {
    try {
      await this.client.close();
      return Errors.VOID_RESULT;
    }
    catch (err) {
      return Errors.errResult(`cannot close DB: ${err}`, 'DB');
    }
  }

  /** Clear out all sensor info in this database
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async clear() : Promise<Errors.Result<void>> {
    try {
      await this.sensorTypes.deleteMany({});
      await this.sensors.deleteMany({});
      await this.sensorReadings.deleteMany({});
      return Errors.VOID_RESULT;
    }
    catch (err) {
      return Errors.errResult(`cannot close DB: ${err}`, 'DB');
    }
  }


  /** Add sensorType to this database.
   *  Error Codes: 
   *    EXISTS: sensorType with specific id already exists in DB.
   *    DB: a database error was encountered.
   */
  async addSensorType(sensorType: SensorType)
    : Promise<Errors.Result<SensorType>>
  {
    try {
      const { id: _id } = sensorType;
      const update = { ...sensorType, _id };
      await this.sensorTypes.insertOne(update);
      return Errors.okResult(sensorType);
    }
    catch (err) {
      return checkDuplicateError(err, sensorType, 'sensorType');
    }
  }

  /** Add sensor to this database.
   *  Error Codes: 
   *    EXISTS: sensor with specific id already exists in DB.
   *    DB: a database error was encountered.
   */
  async addSensor(sensor: Sensor) : Promise<Errors.Result<Sensor>> {
    try {
      const { id: _id } = sensor;
      const update = {...sensor, _id };
      await this.sensors.insertOne(update);
      return Errors.okResult(sensor);
    }
    catch (err) {
      return checkDuplicateError(err, sensor, 'sensor');
    }
  }

  /** Add sensorReading to this database.
   *  Error Codes: 
   *    EXISTS: reading for same sensorId and timestamp already in DB.
   *    DB: a database error was encountered.
   */
  async addSensorReading(sensorReading: SensorReading)
    : Promise<Errors.Result<SensorReading>> 
  {
    try {
      await this.sensorReadings.insertOne({...sensorReading});
      return Errors.okResult(sensorReading);
    }
    catch (err) {
      return checkDuplicateError(err, sensorReading, 'sensorReading');
    }
  }

  /** Find sensor-types which satify search. Returns [] if none. 
   *  Note that all primitive SensorType fields can be used to filter.
   *  The returned array must be sorted by sensor-type id.
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async findSensorTypes(search: SensorTypeSearch)
    : Promise<Errors.Result<SensorType[]>> 
  {
    try {
      const { id, count=DEFAULT_COUNT, index=DEFAULT_INDEX, } = search;
      const query = { ...search, _id: id };
      delete query.count; delete query.index;
      if (!search.id) delete query._id;
      const projection = { _id: 0 };
      const sensorTypes = await this.sensorTypes.find(query, {projection})
	.sort('id')
        .skip(index)
	.limit(count)
	.toArray();
      return Errors.okResult(sensorTypes);
    }
    catch (err) {
      const msg = `cannot find sensorTypes: ${JSON.stringify(search)}: ${err}`;
      return Errors.errResult(msg, 'DB');
    }
  }
  
  /** Find sensors which satify search. Returns [] if none. 
   *  Note that all primitive Sensor fields can be used to filter.
   *  The returned array must be sorted by sensor-type id.
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async findSensors(search: SensorSearch) : Promise<Errors.Result<Sensor[]>> {
    try {
      const { id, count=DEFAULT_COUNT, index=DEFAULT_INDEX, } = search;
      const query = { ...search, _id: id };
      delete query.count; delete query.index;
      if (!search.id) delete query._id;
      const projection = { _id: 0 };
      const sensors = await this.sensors.find(query, {projection})
	.sort('id')
        .skip(index)
	.limit(count)
	.toArray();
      return Errors.okResult(sensors);
    }
    catch (err) {
      const msg = `cannot find sensors: ${JSON.stringify(search)}: ${err}`;
      return Errors.errResult(msg, 'DB');
    }
  }

  /** Find sensor readings which satisfy search. Returns [] if none. 
   *  The returned array must be sorted by timestamp.
   *  Error Codes: 
   *    DB: a database error was encountered.
   */
  async findSensorReadings(search: SensorReadingSearch)
    : Promise<Errors.Result<SensorReading[]>> 
  {
    try {
      const {
	sensorId, minTimestamp, maxTimestamp, minValue, maxValue,
	count=DEFAULT_COUNT, index=DEFAULT_INDEX, 
      } = search;
      const query = {
	sensorId,
	timestamp: { $gte: minTimestamp, $lte: maxTimestamp },
	value: { $gte: minValue, $lte: maxValue },
      };
      const projection = { _id: 0 };
      const sensorReadings =
	await this.sensorReadings.find(query, {projection})
	  .sort('timestamp')
          .skip(index)
	  .limit(count)
	  .toArray();
      return Errors.okResult(sensorReadings);
    }
    catch (err) {
      const msg = `cannot find sensorTypes: ${JSON.stringify(search)}: ${err}`;
      return Errors.errResult(msg, 'DB');
    }
  }
  
} //SensorsDao

//mongo err.code on inserting duplicate entry
const MONGO_DUPLICATE_CODE = 11000;

function checkDuplicateError(err: Error, data: object, dataType: string)  {
  const v = JSON.stringify(data);
  if (err instanceof mongo.MongoServerError
    && err.code === MONGO_DUPLICATE_CODE) {
    return Errors.errResult(`duplicate ${dataType} ${v}`, 'EXISTS');
  }
  else {
    const msg = `cannot add ${dataType} for ${v} to DB: ${err}`;
    return Errors.errResult(msg, 'DB');
  }
}

