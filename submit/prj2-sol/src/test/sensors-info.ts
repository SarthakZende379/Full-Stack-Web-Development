import { SensorsInfo, makeSensorsInfo } from '../lib/sensors-info.js';
import { SensorsDao } from '../lib/sensors-dao.js';

import MemDao from './mem-dao.js';

import DATA from './data/data.js';
import { SPECS } from './data/make-data.js';

import { assert, expect } from 'chai';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly


describe('sensors', () => {

  describe('sensor-type add validity checks', () => {

    let sensorsInfo: SensorsInfo;
    let dao: SensorsDao;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult = await makeSensorsInfo(dao);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
    });

    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
  
    it('must successfully add valid sensor-type', async () => {
      const addResult = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult.isOk === true);
      expect(addResult.val).to.deep.equal(DATA.SENSOR_TYPE1_VAL);
    });

    it('must error EXISTS on duplicate sensor-type', async () => {
      const addResult1 = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult1.isOk === true);
      const addResult2 = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult2.isOk === false);
      expect(addResult2.errors[0].options.code).to.equal('EXISTS');
    });

    it('must detect missing required fields', async () => {
      for (const k of Object.keys(DATA.SENSOR_TYPE1)) {
	const sensorType = {...DATA.SENSOR_TYPE1};
	delete sensorType[k];
	const addResult = await sensorsInfo.addSensorType(sensorType);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it('must detect non-numeric min/max fields', async () => {
      for (const k of ['min', 'max']) {
	const sensorType = {...DATA.SENSOR_TYPE1};
	sensorType[k] += 'x';
	const addResult = await sensorsInfo.addSensorType(sensorType);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_VAL');
      }
    });
    
    it('must detect min > max error', async () => {
      const sensorType = {...DATA.SENSOR_TYPE1};
      [sensorType.min, sensorType.max] = [sensorType.max, sensorType.min];
      const addResult = await sensorsInfo.addSensorType(sensorType);
      assert(addResult.isOk === false);
      const errors = addResult.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_RANGE');
    });
    
  });

  describe('sensor add validity checks', () => {

    let sensorsInfo: SensorsInfo;
    let dao: SensorsDao;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult = await makeSensorsInfo(dao);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
      const addResult = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult.isOk === true);
    });

    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
      
    it('must successfully add valid sensor', async () => {
      const addResult = await sensorsInfo.addSensor(DATA.SENSOR1);
      assert(addResult.isOk === true);
      expect(addResult.val).to.deep.equal(DATA.SENSOR1_VAL);
    });

    it('must error EXISTS on duplicate sensor', async () => {
      assert.fail('TODO');
    });

    it ('must detect missing required fields', async () => {
      for (const k of Object.keys(DATA.SENSOR1)) {
	const sensor = {...DATA.SENSOR1};
	delete sensor[k];
	const addResult = await sensorsInfo.addSensor(sensor);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it('must detect non-numeric min/max fields', async () => {
      for (const k of ['min', 'max']) {
	const sensor = {...DATA.SENSOR1};
	sensor[k] += 'x';
	const addResult = await sensorsInfo.addSensor(sensor);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_VAL');
      }
    });
    
    it('must detect min > max error', async () => {
      const sensor = {...DATA.SENSOR1};
      [sensor.min, sensor.max] = [sensor.max, sensor.min];
      const addResult = await sensorsInfo.addSensor(sensor);
      assert(addResult.isOk === false);
      const errors = addResult.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must detect bad sensor-type ID', async () => {
      const sensor = {...DATA.SENSOR1};
      sensor.sensorTypeId += 'x';
      const addResult = await sensorsInfo.addSensor(sensor);
      assert(addResult.isOk === false);
      const errors = addResult.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_ID');
    });

    it('must detect expected range inconsistent with sensor-type', async () => {
      for (const k of ['min', 'max']) {
	const sensor = {...DATA.SENSOR1};
	const inc = k === 'min' ? -1 : 1;
	sensor[k] = String(Number(DATA.SENSOR_TYPE1[k]) + inc);
	const addResult = await sensorsInfo.addSensor(sensor);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_RANGE');
      }
    });

  });

  describe('sensor reading add validity checks', () => {

    let sensorsInfo: SensorsInfo;
    let dao: SensorsDao;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult = await makeSensorsInfo(dao);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
      const addResult1 = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult1.isOk === true);
      const addResult2 = await sensorsInfo.addSensor(DATA.SENSOR1);
      assert(addResult2.isOk === true);
    });
 
    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
     
    it('must successfully add a valid sensor reading', async () => {
      const addResult =
	await sensorsInfo.addSensorReading(DATA.SENSOR_READING1);
      assert(addResult.isOk === true);
      expect(addResult.val).to.deep.equal(DATA.SENSOR_READING1_VAL);
    });

    it('must error EXISTS on duplicate sensor reading', async () => {
      assert.fail('TODO');
    });

    it ('must detect missing required fields', async () => {
      for (const k of Object.keys(DATA.SENSOR_READING1)) {
	const sensorReading = {...DATA.SENSOR_READING1};
	delete sensorReading[k];
	const addResult = await sensorsInfo.addSensorReading(sensorReading);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it ('must detect an incorrect sensorId field', async () => {
      const sensorReading = {...DATA.SENSOR_READING1};
      sensorReading.sensorId += 'x';
      const addResult = await sensorsInfo.addSensorReading(sensorReading);
      assert(addResult.isOk === false);
      const errors = addResult.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_ID');
    });

    it('must detect non-numeric timestamp and value fields', async () => {
      for (const k of ['timestamp', 'value']) {
	const sensorReading = {...DATA.SENSOR_READING1};
	sensorReading[k] += 'x';
	const addResult = await sensorsInfo.addSensorReading(sensorReading);
	assert(addResult.isOk === false);
	const errors = addResult.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_VAL');
      }
    });

  });

  describe('sensor-types search', () => {

    let sensorsInfo : SensorsInfo;
    let dao: SensorsDao;
    const specs = SPECS['test-sensor-types'];
    const { sensorTypes, sensors, sensorReadings } = DATA.testFindSensorTypes;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult =
	await makeSensorsInfo(dao, sensorTypes, sensors, sensorReadings);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
    });
 
    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
     
    it('must find all sensor types', async () => {
      const findResult = await sensorsInfo.findSensorTypes({});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(specs.nSensorTypes);
    });
    
    it('must find all sensor types sorted by id', async () => {
      const findResult = await sensorsInfo.findSensorTypes({});
      assert(findResult.isOk === true);
      expect(isSortedIds(findResult.val)).to.be.true;
    });
    
    it('must find all sensor types for a particular manufacturer', async () => {
      const findResult = 
	await sensorsInfo.findSensorTypes({manufacturer: 'Honeywell'});
      assert(findResult.isOk === true);
      const nExpectedResults = specs.nSensorTypes/specs.nManufacturers;
      expect(findResult.val).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown manufacturer', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({manufacturer: 'Honeywell1'});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
    it('must find all sensor types for a particular quantity', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({quantity: 'pressure'});
      assert(findResult.isOk === true);
      const nExpectedResults = specs.nSensorTypes/specs.nQuantities;
      expect(findResult.val).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown quantity', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({quantity: 'pressure1'});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
    it('must find a single sensor type having a particular id', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({id: sensorTypes[0].id});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(1);
    });

    it('must find sensor type using a non-indexed field', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({unit: sensorTypes[0].unit});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(specs.nManufacturers);
    });

    it('must not find any sensor type having an invalid id', async () => {
      const findResult =
	await sensorsInfo.findSensorTypes({id: sensorTypes[0].id + 'x'});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });

    it('must find a single sensor type having a particular modelNumber',
       async () =>
    {
      const query = {modelNumber: sensorTypes[1].modelNumber};
      const findResult = await sensorsInfo.findSensorTypes(query);
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(1);
    });
    
    it('must find a single sensor type having a id and quantity', async () => {
      const { id, quantity } = sensorTypes[1];
      const findResult = await sensorsInfo.findSensorTypes({id, quantity});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(1);
    });
    
    it('must not find type with inconsistent id and quantity', async () => {
      const { id, quantity } = sensorTypes[1];
      const qOther =
	sensorTypes.map(s => s.quantity).find(q => q !== quantity)!;
      const findResult =
	await sensorsInfo.findSensorTypes({id, quantity: qOther});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
    
    
  });

  describe('sensors search', () => {

    let sensorsInfo : SensorsInfo;
    let dao: SensorsDao;
    const specs = SPECS['test-sensors'];
    const { sensorTypes, sensors, sensorReadings } = DATA.testFindSensors;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult =
	await makeSensorsInfo(dao, sensorTypes, sensors, sensorReadings);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
    });

    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
  
    it('must find all sensors', async () => {
      const findResult = await sensorsInfo.findSensors({});
      assert(findResult.isOk === true);
      const nExpectedResults = specs.nSensorTypes*specs.nSensorsPerSensorType;
      expect(findResult.val).to.have.length(nExpectedResults);
    });
    
    it('must find all sensors sorted by id', async () => {
      const findResult = await sensorsInfo.findSensors({});
      assert(findResult.isOk === true);
      expect(isSortedIds(findResult.val)).to.be.true;
    });
    
    it('must find all sensors having a particular sensorTypeId', async () => {
      const findResult =
	await sensorsInfo.findSensors({sensorTypeId: sensorTypes[0].id});
      assert(findResult.isOk === true);
      const nExpectedResults = specs.nSensorsPerSensorType;
      expect(findResult.val).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown sensorTypeId', async () => {
      const findResult =
	await sensorsInfo.findSensors({sensorTypeId: sensorTypes[0].id + 'x'});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
    it('must find a single sensor having a particular id', async () => {
      const findResult = await sensorsInfo.findSensors({id: sensors[0].id});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(1);
    });

    it('must not find any sensor having an invalid id', async () => {
      const findResult =
	await sensorsInfo.findSensors({id: sensors[0].id + 'x'});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
    it('must find a single sensor having an id and sensorTypeId', async () => {
      const { id, sensorTypeId } = sensors[1];
      const findResult = await sensorsInfo.findSensors({id, sensorTypeId});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(1);
    });
    
    it('must not find type with inconsistent id and sensorTypeId', async () => {
      const {id, sensorTypeId} = sensors[1];
      const sOther =
	sensors.map(s => s.sensorTypeId).find(id => id !== sensorTypeId)!;
      const findResult = await sensorsInfo.findSensors({id, sensorTypeId: sOther});
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(0);
    });
    
  });

  describe('sensor readings search', () => {

    let sensorsInfo : SensorsInfo;
    let dao: SensorsDao;
    const specs = SPECS['test-sensor-readings'];
    const { sensorTypes, sensors, sensorReadings } =
      DATA.testFindSensorReadings;

    beforeEach(async () => {
      dao = await MemDao.setup();
      const sensorsInfoResult =
	await makeSensorsInfo(dao, sensorTypes, sensors, sensorReadings);
      assert(sensorsInfoResult.isOk === true);
      sensorsInfo = sensorsInfoResult.val;
    });
 
    afterEach(async () => {
      await MemDao.tearDown(dao);
    });
     
    it('must error on missing sensorId', async () => {
      const sensorId = sensors[0].id;
      const findResult = await sensorsInfo.findSensorReadings({value: '2'});
      assert(findResult.isOk === false);
      expect(findResult.errors[0].options.code).to.equal('REQUIRED');
    });

    it('must error on invalid timestamp range', async () => {
      const sensorId = sensors[0].id;
      const search = { sensorId, minTimestamp: '2', maxTimestamp: '1' };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === false);
      expect(findResult.errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must error on invalid value range', async () => {
      const sensorId = sensors[0].id;
      const search = { sensorId, minValue: '2', maxValue: '1' };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === false);
      expect(findResult.errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must find all sensor readings for a particular sensor', async () => {
      const sensorId = sensors[0].id;
      const findResult = await sensorsInfo.findSensorReadings({sensorId});
      assert(findResult.isOk === true);
      const nExpectedResults = specs.nReadingsPerSensor;
      expect(findResult.val).to.have.length(nExpectedResults);
    });

    it('must find all sensor readings sorted numerically by timestamp',
       async () =>
    {
      const sensorId = sensors[0].id;
      const findResult = await sensorsInfo.findSensorReadings({sensorId});
      assert(findResult.isOk === true);
      expect(isSortedTimestamps(findResult.val)).to.be.true;
    });
    
    it('must find all sensor readings within a particular timeframe',
       async () =>
    {
      const {id: sensorId, period} = sensors[0];
      const n = 3;
      const minTimestamp =
	String(Math.min(...sensorReadings.map(r => Number(r.timestamp))));
      const maxTimestamp =
	String(Number(minTimestamp) + (n-1) * Number(period));
      const search = { sensorId, minTimestamp, maxTimestamp };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === true);
      expect(findResult.val).to.have.length(n);
    });

    it('must find all sensor readings having a particular value', async () => {
      const {id: sensorId} = sensors[0];
      const value = String(specs.limitsRangeLo);
      const [minValue, maxValue] = [value, value];
      const search = { sensorId, minValue, maxValue };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === true);
      const nExpectedResults =
	specs.nReadingsPerSensor/(2*specs.rangeAroundNominalValue + 1)
      expect(findResult.val).to.have.length(nExpectedResults);
    });

    it('must find all sensor readings greater than a particular value',
       async () =>
    {
      const {id: sensorId} = sensors[0];
      const { nReadingsPerSensor: n, limitsRangeLo: lo,
	      rangeAroundNominalValue: range } = specs;
      const minValue = String(Number(lo) - Number(range) + 1);
      const search = { sensorId, minValue };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === true);
      const nExpectedResults = n - n/(2*range + 1);
      expect(findResult.val).to.have.length(nExpectedResults);
    });

    it('must find sensor readings with a certain value in a interval',
       async () =>
    {
      const {id: sensorId, period} = sensors[0];
      const { nReadingsPerSensor: n, limitsRangeLo: lo,
	      rangeAroundNominalValue: range } = specs;
      const valuePeriod = 2*range + 1;
      const tMin = Math.min(...sensorReadings.map(r => Number(r.timestamp)));
      const tMax = Math.max(...sensorReadings.map(r => Number(r.timestamp)));
      const minTimestamp = String(tMin + valuePeriod*Number(period));
      const maxTimestamp = String(tMax - valuePeriod*Number(period));
      const [minValue, maxValue] = [String(lo), String(lo)];
      const search =
	{ sensorId, minValue, maxValue, minTimestamp, maxTimestamp, };
      const findResult = await sensorsInfo.findSensorReadings(search);
      assert(findResult.isOk === true);
      const nExpectedResults = n/(2*range + 1) - 2;
      expect(findResult.val).to.have.length(nExpectedResults);
    });


  });
    
});

type IdType = { id: string };
function isSortedIds(idTypes: IdType[]) {
  return idTypes.slice(0, -1)
    .every((e, i) => e.id.localeCompare(idTypes[i+1].id));
}

type TimestampType = { timestamp: number };
function isSortedTimestamps(timestamps: TimestampType[]) {
  return timestamps.slice(0, -1)
    .every((t, i) => t.timestamp - timestamps[i+1].timestamp);
}
