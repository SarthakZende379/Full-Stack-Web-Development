import { SensorType, Sensor, SensorReading,
	 SensorTypeSearch, SensorSearch, SensorReadingSearch,
       } from './validators.js';
import { SensorsDao } from './sensors-dao.js';

import { Errors, Checkers } from 'cs544-js-utils';

type FlatReq = Checkers.FlatReq; //dictionary mapping strings to strings

//marks T as having being run through validate()
type Checked<T> = Checkers.Checked<T>;

/*********************** Top Level Sensors Info ************************/

export class SensorsInfo {

  constructor(private readonly dao: SensorsDao) {
  }


  /** Clear out all sensors info from this object.  Return empty array */
  async clear() : Promise<Errors.Result<void>> {
    return await this.dao.clear();
  }

  /** Add sensor-type defined by req to this.  If there is already a
   *  sensor-type having the same id, then replace it. Return single
   *  element array containing the added sensor-type.
   *
   *  Error Codes:
   *     'REQUIRED': a required field is missing.
   *     'BAD_VAL': a bad value in a field (a numeric field is not numeric)
   *     'BAD_RANGE': an incorrect range with min >= max.
   */
  async addSensorType(req: FlatReq) : Promise<Errors.Result<SensorType>> {
    const sensorTypeResult = SensorType.make(req);
    if (!sensorTypeResult.isOk) return sensorTypeResult;
    const sensorType = sensorTypeResult.val;
    return await this.dao.addSensorType(sensorType);
  }
  
  /** Add sensor defined by req to this.  If there is already a 
   *  sensor having the same id, then replace it.  Return single element
   *  array containing the added sensor.
   *
   *  Error Codes:
   *     'REQUIRED': a required field is missing.
   *     'BAD_VAL': a bad value in a field (a numeric field is not numeric)
   *     'BAD_RANGE': an incorrect range with min >= max.
   *     'BAD_ID': unknown sensorTypeId.
   */
  async addSensor(req: FlatReq): Promise<Errors.Result<Sensor>> {
    const sensorResult = Sensor.make(req);
    if (!sensorResult.isOk) return sensorResult;
    const sensor = sensorResult.val;
    const sensorTypesResult =
      await this.dao.findSensorTypes({id: sensor.sensorTypeId} as SensorTypeSearch);
    if (!sensorTypesResult.isOk) return sensorTypesResult;
    const sensorTypes = sensorTypesResult.val;
    if (sensorTypes.length !== 1) {
      return Errors.errResult(`unknown sensor type "${sensor.sensorTypeId}"`,
			      'BAD_ID', 'sensorTypeId');
    }
    const [ sensorType ] = sensorTypes;
    if (!sensor.expected.isSubrange(sensorType.limits)) {
      const {min: min0, max: max0} = sensorType.limits;
      const {min: min1, max: max1} = sensor.expected;      
      return Errors.errResult(`expected range [${min1}, ${max1}] of sensor `
	+ `"${sensor.id}" is not within the limits [${min0}, ${max0}] ` 
	+ `of sensor-type "${sensor.sensorTypeId}"`, 'BAD_RANGE', 'min');
    }
    return await this.dao.addSensor(sensor);
  }

  /** Add sensor reading defined by req to this.  If there is already
   *  a reading for the same sensorId and timestamp, then replace it.
   *  Return single element array containing added sensor reading.
   *
   *  Error Codes:
   *     'REQUIRED': a required field is missing.
   *     'BAD_VAL': a bad value in a field (a numeric field is not numeric)
   *     'BAD_RANGE': an incorrect range with min >= max.
   *     'BAD_ID': unknown sensorId.
   */
  async addSensorReading(req: FlatReq) : Promise<Errors.Result<SensorReading>> {
    const sensorReadingResult = SensorReading.make(req);
    if (!sensorReadingResult.isOk) return sensorReadingResult;
    const sensorReading = sensorReadingResult.val;
    const sensorsResult =
      await this.dao.findSensors({id: sensorReading.sensorId} as SensorSearch);
    if (!sensorsResult.isOk) return sensorsResult;
    const sensors = sensorsResult.val;
    if (sensors.length !== 1) {
      return Errors.errResult(`unknown sensor id "${sensorReading.sensorId}"`,
			      'BAD_ID', 'sensorId');
    }
    return await this.dao.addSensorReading(sensorReading);
  }

  /** Find sensor-types which satify req. Returns [] if none. 
   *  Note that all primitive SensorType fields can be used to filter.
   *  The returned array must be sorted by sensor-type id.
   */
  async findSensorTypes(req: FlatReq) : Promise<Errors.Result<SensorType[]>> {
    const validResult: Errors.Result<SensorTypeSearch> =
      SensorTypeSearch.make(req);
    if (!validResult.isOk) return validResult;
    const sensorTypeSearch = validResult.val;
    const result = await this.dao.findSensorTypes(sensorTypeSearch);
    return result;
  }
  
  /** Find sensors which satify req. Returns [] if none. 
   *  Note that all primitive Sensor fields can be used to filter.
   *  The returned array must be sorted by sensor id.
   */
  async findSensors(req: FlatReq) : Promise<Errors.Result<Sensor[]>> { 
    const validResult: Errors.Result<SensorSearch> = SensorSearch.make(req);
    if (!validResult.isOk) return validResult;
    const sensorsSearch = validResult.val;
    return await this.dao.findSensors(sensorsSearch);
  }
  
  /** Find sensor readings which satify req. Returns [] if none.  Note
   *  that req must contain sensorId to specify the sensor whose
   *  readings are being requested.  Additionally, it may use
   *  partially specified inclusive bounds [minTimestamp,
   *  maxTimestamp] and [minValue, maxValue] to filter the results.
   *
   *  The returned array must be sorted numerically by timestamp.
   */
  async findSensorReadings(req: FlatReq)
    : Promise<Errors.Result<SensorReading[]>> 
  {
    const validResult: Errors.Result<SensorReadingSearch> =
      SensorReadingSearch.make(req);
    if (!validResult.isOk) return validResult;
    const search = validResult.val;
    return await this.dao.findSensorReadings(search);
  }
  
}

/*********************** SensorsInfo Factory Functions *****************/

export async function makeSensorsInfo(dao: SensorsDao,
				      sensorTypes: FlatReq[]=[],
				      sensors: FlatReq[]=[],
				      sensorReadings: FlatReq[]=[])
  : Promise<Errors.Result<SensorsInfo>>
{
  const sensorsInfo = new SensorsInfo(dao);
  const addResult = 
    await addSensorsInfo(sensorTypes, sensors, sensorReadings, sensorsInfo);
  if (!addResult.isOk) return addResult;
  return Errors.okResult(sensorsInfo);
}

export async function addSensorsInfo(sensorTypes: FlatReq[], sensors: FlatReq[],
				     sensorReadings: FlatReq[],
				     sensorsInfo: SensorsInfo)
  : Promise<Errors.Result<void>>
{
  for (const sensorType of sensorTypes) {
    const result = await sensorsInfo.addSensorType(sensorType);
    if (!result.isOk) return result;
  }
  for (const sensor of sensors) {
    const result = await sensorsInfo.addSensor(sensor);
    if (!result.isOk) return result;
  }
  for (const reading of sensorReadings) {
    const result = await sensorsInfo.addSensorReading(reading);
    if (!result.isOk) return result;
  }
  return Errors.VOID_RESULT;
}



