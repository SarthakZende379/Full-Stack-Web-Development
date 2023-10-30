import { SensorType, Sensor, SensorReading, SensorTypeSearch, SensorSearch, SensorReadingSearch } from './validators.js';
import { Errors, } from 'cs544-js-utils';
import * as mongo from 'mongodb';
import { MongoClient, Db } from 'mongodb';
import { ObjectId } from 'mongodb';
/** All that this DAO should do is maintain a persistent data for sensors.
*
*  Most routines return an errResult with code set to 'DB' if
*  a database error occurs.
*/
// MongoDB collection names
const SENSOR_TYPES_COLLECTION = 'sensorTypes';
const SENSORS_COLLECTION = 'sensors';
const SENSOR_READINGS_COLLECTION = 'sensorReadings';

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
 private readonly client: MongoClient;
 private readonly db: Db;
 
 private constructor(client: MongoClient, db: Db) {
   this.client = client;
   this.db = db;
 }

 /** factory method
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 static async make(dbUrl: string): Promise<Errors.Result<SensorsDao>> {
   try {
     const client = new MongoClient(dbUrl, MONGO_OPTIONS);
     await client.connect();
     const db = client.db();
     return Errors.okResult(new SensorsDao(client, db));
   } catch (error) {
     console.error('Failed to connect to the database:', error);
     return Errors.errResult('DB', 'Failed to connect to the database');
   }
 }

 /** Release all resources held by this dao.
  *  Specifically, close any database connections.
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 async close(): Promise<Errors.Result<void>> {
   try {
     await this.client.close();
     return Errors.VOID_RESULT;
   } catch (error) {
     console.error('Error closing database connection:', error);
     return Errors.errResult('DB', 'Failed to close the database connection');
   }
 }

 /** Clear out all sensor info in this database
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 async clear(): Promise<Errors.Result<void>> {
   try {
     await this.db.collection(SENSOR_TYPES_COLLECTION).deleteMany({});
     await this.db.collection(SENSORS_COLLECTION).deleteMany({});
     await this.db.collection(SENSOR_READINGS_COLLECTION).deleteMany({});
     return Errors.VOID_RESULT;
   } catch (error) {
     console.error('Error clearing sensor info:', error);
     return Errors.errResult('DB', 'Failed to clear sensor info from the database');
   }
 }


 /** Add sensorType to this database.
  *  Error Codes: 
  *    EXISTS: sensorType with specific id already exists in DB.
  *    DB: a database error was encountered.
  */
 async addSensorType(sensorType: SensorType): Promise<Errors.Result<SensorType>> {
  try {
    // Validate the sensor type fields here, similar to how you did in your original code.
    
    // Check for existing sensor type.
    const objectId = new ObjectId(sensorType.id);
    const existingSensorType = await this.db.collection(SENSOR_TYPES_COLLECTION).findOne({ _id: objectId });

    if (existingSensorType) {
      // Sensor type with the specified id already exists.
      return Errors.errResult(`Sensor type with id '${sensorType.id}' already exists`, 'EXISTS');
    }

    // Use upsert to insert or update the sensor type in the database.
    const result = await this.db.collection(SENSOR_TYPES_COLLECTION).updateOne(
      { _id: objectId },
      { $set: sensorType },
      { upsert: true }
    );

    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
      // Sensor type added or updated successfully.
      return Errors.okResult(sensorType);
    } else {
      // An error occurred (this case should be handled as a DB error).
      return Errors.errResult('DB', 'Failed to add sensor type to the database');
    }
  } catch (error) {
    // Handle any unexpected errors (DB error or other error).
    console.error('Error adding sensor type:', error);
    return Errors.errResult('DB', 'Failed to add sensor type to the database');
  }
}

 /** Add sensor to this database.
  *  Error Codes: 
  *    EXISTS: sensor with specific id already exists in DB.
  *    DB: a database error was encountered.
  */
 async addSensor(sensor: Sensor): Promise<Errors.Result<Sensor>> {
  try {
    // Check if the sensor already exists in the database.
    const objectId = new ObjectId(sensor.id);
    const existingSensor = await this.db.collection(SENSORS_COLLECTION).findOne({ _id: objectId });

    if (existingSensor) {
      // Sensor with the specified id already exists.
      return Errors.errResult(`Sensor with id '${sensor.id}' already exists`, 'EXISTS');
    }

    // Use upsert to insert or update the sensor in the database.
    const result = await this.db.collection(SENSORS_COLLECTION).updateOne(
      { _id: objectId },
      { $set: sensor },
      { upsert: true }
    );

    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
      // Sensor added or updated successfully.
      return Errors.okResult(sensor);
    } else {
      // An error occurred (this case should be handled as a DB error).
      return Errors.errResult('DB', 'Failed to add sensor to the database');
    }
  } catch (error) {
    // Handle any unexpected errors (DB error or other error).
    console.error('Error adding sensor:', error);
    return Errors.errResult('DB', 'Failed to add sensor to the database');
  }
}
  

async addSensorReading(sensorReading: SensorReading): Promise<Errors.Result<SensorReading>> {
  try {
    // Check if a reading with the same sensorId and timestamp already exists in the database.
    const query = {
      sensorId: new ObjectId(sensorReading.sensorId),
      timestamp: sensorReading.timestamp,
    };

    const existingReading = await this.db.collection(SENSOR_READINGS_COLLECTION).findOne(query);

    if (existingReading) {
      // Reading for the same sensorId and timestamp already exists.
      return Errors.errResult('Reading for the same sensorId and timestamp already exists', 'EXISTS');
    }

    // Use upsert to insert or update the sensor reading in the database.
    const result = await this.db.collection(SENSOR_READINGS_COLLECTION).updateOne(
      query,
      { $set: sensorReading },
      { upsert: true }
    );

    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
      // Sensor reading added or updated successfully.
      return Errors.okResult(sensorReading);
    } else {
      // An error occurred (this case should be handled as a DB error).
      return Errors.errResult('DB', 'Failed to add sensor reading to the database');
    }
  } catch (error) {
    // Handle any unexpected errors (DB error or other error).
    console.error('Error adding sensor reading:', error);
    return Errors.errResult('DB', 'Failed to add sensor reading to the database');
  }
}
 
 // Helper function to build the query based on search criteria
 private buildSensorReadingQuery(search: SensorReadingSearch) {
  const query: any = {};

  // Check and add search criteria
  if (search.sensorId) {
    query.sensorId = search.sensorId;
  }
  if (search.minTimestamp !== undefined || search.maxTimestamp !== undefined) {
    query.timestamp = {};
    if (search.minTimestamp !== undefined) {
      query.timestamp.$gte = search.minTimestamp;
    }
    if (search.maxTimestamp !== undefined) {
      query.timestamp.$lte = search.maxTimestamp;
    }
  }
  if (search.minValue !== undefined || search.maxValue !== undefined) {
    query.value = {};
    if (search.minValue !== undefined) {
      query.value.$gte = search.minValue;
    }
    if (search.maxValue !== undefined) {
      query.value.$lte = search.maxValue;
    }
  }

  return query;
}
// Helper function to build the query based on sensor type search criteria
private buildSensorTypeQuery(search: SensorTypeSearch) {
  const query: any = {};

  // Check and add search criteria for sensor type
  if (search.manufacturer) {
    query.manufacturer = search.manufacturer;
  }
  if (search.modelNumber) {
    query.modelNumber = search.modelNumber;
  }
  if (search.quantity) {
    query.quantity = search.quantity;
  }
  if (search.unit) {
    query.unit = search.unit;
  }
  // Add other criteria as needed

  return query;
}

// Helper function to build the query based on sensor search criteria
private buildSensorQuery(search: SensorSearch) {
  const query: any = {};

  // Check and add search criteria for sensor
  if (search.sensorTypeId !== null && search.sensorTypeId !== undefined) {
    query.sensorTypeId = search.sensorTypeId;
  }

  // Add other criteria as needed, e.g., for id
  if (search.id !== null && search.id !== undefined) {
    query.id = search.id;
  }

  return query;
}


 
/** Find sensor-types which satify search. Returns [] if none. 
  *  Note that all primitive SensorType fields can be used to filter.
  *  The returned array must be sorted by sensor-type id.
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 async findSensorTypes(search: SensorTypeSearch): Promise<Errors.Result<SensorType[]>> {
   try {
     const query = this.buildSensorTypeQuery(search); // Build your query based on the search parameters
     const cursor = this.db.collection(SENSOR_TYPES_COLLECTION).find(query).sort({ id: 1 }); // Sort by sensor-type id
     const sensorTypesWithId = await cursor.toArray();

     // Map documents to SensorType objects
     const sensorTypes: SensorType[] = sensorTypesWithId.map((doc) => ({
       id: doc.id,
       manufacturer: doc.manufacturer,
       modelNumber: doc.modelNumber,
       quantity: doc.quantity,
       unit: doc.unit,
       limits: doc.limits,
       // Add other properties as needed
     }));

     return Errors.okResult(sensorTypes);
   } catch (error) {
     console.error('Error finding sensor types:', error);
     return Errors.errResult('DB', 'Failed to find sensor types in the database');
   }
 }

 /** Find sensors which satify search. Returns [] if none. 
  *  Note that all primitive Sensor fields can be used to filter.
  *  The returned array must be sorted by sensor-type id.
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 async findSensors(search: SensorSearch): Promise<Errors.Result<Sensor[]>> {
   try {
     const query = this.buildSensorQuery(search);
     const cursor = this.db.collection(SENSORS_COLLECTION).find(query).sort({ id: 1 });
     const sensorDocuments = await cursor.toArray();
 
     // Map the MongoDB documents to Sensor objects
     const sensors = sensorDocuments.map((doc) => ({
       id: doc.id,
       sensorTypeId: doc.sensorTypeId,
       period: doc.period,
       expected: doc.expected,
       // Add other properties as needed
     }));
 
     return Errors.okResult(sensors);
   } catch (error) {
     console.error('Error finding sensors:', error);
     return Errors.errResult('DB', 'Failed to find sensors in the database');
   }
 }
 

 /** Find sensor readings which satisfy search. Returns [] if none. 
  *  The returned array must be sorted by timestamp.
  *  Error Codes: 
  *    DB: a database error was encountered.
  */
 async findSensorReadings(search: SensorReadingSearch): Promise<Errors.Result<SensorReading[]>> {
   try {
     const query = this.buildSensorReadingQuery(search);
     const cursor = this.db.collection(SENSOR_READINGS_COLLECTION).find(query).sort({ timestamp: 1 });
     const sensorReadingDocuments = await cursor.toArray();
 
     // Map the MongoDB documents to SensorReading objects
     const sensorReadings = sensorReadingDocuments.map((doc) => ({
       sensorId: doc.sensorId,
       timestamp: doc.timestamp,
       value: doc.value,
       // Add other properties as needed
     }));
 
     return Errors.okResult(sensorReadings);
   } catch (error) {
     console.error('Error finding sensor readings:', error);
     return Errors.errResult('DB', 'Failed to find sensor readings in the database');
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