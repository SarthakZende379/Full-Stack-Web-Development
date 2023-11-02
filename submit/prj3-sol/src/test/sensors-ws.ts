import STATUS from 'http-status';

import { App, serve } from '../lib/sensors-ws.js';

import supertest from 'supertest';

//will run the project DAO using an in-memory mongodb server
import MemSensorsDao from './mem-dao.js';

import { SensorsDao, } from '../lib/sensors-dao.js';
import { SensorsInfo, makeSensorsInfo, addSensorsInfo }
  from '../lib/sensors-info.js';

import { SensorType, Sensor, SensorReading } from '../lib/validators.js';
import { DEFAULT_COUNT } from '../lib/params.js';

import DATA from './data/data.js';
import { SPECS } from './data/make-data.js';

import { assert, expect } from 'chai';

const BASE = '/sensors-info';


describe('web services', () => {
  
  //mocha will run beforeEach() before each test to set up these variables
  let dao: SensorsDao;
  let sensorsInfo: SensorsInfo;
  let ws: ReturnType<typeof supertest>;
  
  beforeEach(async function () {
    dao = await MemSensorsDao.setup();
    const sensorsInfoResult = await makeSensorsInfo(dao);
    assert(sensorsInfoResult.isOk === true);
    sensorsInfo = sensorsInfoResult.val;
    const app: App = serve(sensorsInfo, { base: BASE}).app;
    ws = supertest(app);
  });
	 
  //mocha runs this after each test; we use this to clean up the DAO.
  afterEach(async function () {
    await MemSensorsDao.tearDown(dao);
  });


  describe('sensor-type addition and retrieval', () => {

    let url: string;
    let sensorTypeData: Record<string, string>;
    let sensorType: SensorType;

    beforeEach(() => {
      url = `${BASE}/sensor-types`;
      sensorTypeData = DATA.SENSOR_TYPE1; 
      const sensorTypeResult = SensorType.make(sensorTypeData);
      assert(sensorTypeResult.isOk === true);
      sensorType = sensorTypeResult.val;
    });

    it('must successfully add valid sensor-type', async () => {
      const res =
	await ws.put(url)
	.set('Content-Type', 'application/json')
        .send(sensorTypeData);
      expect(res.status).to.equal(STATUS.CREATED);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('PUT');
      expect(links?.self?.href).to.equal(url);
      expect(res.body.result).to.deep.equal(sensorType);
      expect(res.headers.location).to.equal(`${url}/${sensorType.id}`);
    });

    it('must successfully retrieve added sensor-type', async () => {
      const res1 =
	await ws.put(url)
	.set('Content-Type', 'application/json')
        .send(sensorTypeData);
      expect(res1.status).to.equal(STATUS.CREATED);
      const url1 = `${url}/${sensorTypeData.id}`;
      const res2 = await ws.get(url1)
      expect(res2.status).to.equal(STATUS.OK);
      expect(res2.body?.isOk).to.equal(true);
      const links = res2.body?.links;
      expect(links?.self?.method).to.equal('GET');
      expect(links?.self?.href).to.equal(url1);
      expect(res2.body.result).to.deep.equal(sensorType);
    });

    it('must fail to retrieve unknown sensor-type', async () => {
      const url1 = `${url}/${sensorTypeData.id}`;
      const res = await ws.get(url1)
      expect(res.status).to.equal(STATUS.NOT_FOUND);
    });

    it('must error EXISTS on duplicate sensor-type', async () => {
      const res1 =
	await ws.put(url)
	.set('Content-Type', 'application/json')
        .send(sensorTypeData);
      expect(res1.status).to.equal(STATUS.CREATED);
      const res2 =
	await ws.put(url)
	.set('Content-Type', 'application/json')
        .send(sensorTypeData);
      expect(res2.status).to.equal(STATUS.CONFLICT);
    });

    it('must error REQUIRED on missing required fields', async () => {
      for (const k of Object.keys(sensorTypeData)) {
	const sensorTypeData1 = {...sensorTypeData };
	delete sensorTypeData1[k];
	const res =
	  await ws.put(url)
	    .set('Content-Type', 'application/json')
            .send(sensorTypeData1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	expect(res.body.errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it('must error BAD_VAL on non-numeric min/max fields', async () => {
      for (const k of ['min', 'max']) {
	const sensorTypeData1 = {...sensorTypeData};
	sensorTypeData1[k] += 'x';
	const res =
	  await ws.put(url)
	    .set('Content-Type', 'application/json')
            .send(sensorTypeData1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	expect(res.body.errors[0].options.code).to.equal('BAD_VAL');
      }
    });

    it('must error BAD_RANGE min > max error', async () => {
      const data = {...sensorTypeData };
      [data.min, data.max] = [data.max, data.min];
      const res =
	await ws.put(url)
	  .set('Content-Type', 'application/json')
          .send(data);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      expect(res.body.errors[0].options.code).to.equal('BAD_RANGE');
    });
    
  });

  describe('sensor add validity checks', () => {

    const sensorData = DATA.SENSOR1;
    const url = `${BASE}/sensors`;
    let sensor: Sensor;

    beforeEach(async () => {
      const makeSensorResult = Sensor.make(sensorData);
      assert(makeSensorResult.isOk === true, `makeSensor: ${makeSensorResult}`);
      sensor = makeSensorResult.val;
      const addResult = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult.isOk === true, `addSensorType: ${addResult}`);
    });


    it('must successfully add valid sensor', async () => {
      const res = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(sensorData);
      expect(res.status).to.equal(STATUS.CREATED);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('PUT');
      expect(links?.self?.href).to.equal(url);
      expect(res.body.result).to.deep.equal(sensor);
      expect(res.headers.location).to.equal(`${url}/${sensor.id}`);
    });

    it('must retrieve added sensor', async () => {
      const res1 = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(sensorData);
      expect(res1.status).to.equal(STATUS.CREATED);
      expect(res1.body?.isOk).to.equal(true);

      const url2 = `${url}/${sensor.id}`;
      const res2 = await ws.get(url2);
      expect(res2.status).to.equal(STATUS.OK);
      expect(res2.body?.isOk).to.equal(true);
      const links = res2.body?.links;
      expect(links?.self?.method).to.equal('GET');
      expect(links?.self?.href).to.equal(url2);
      expect(res2.body.result).to.deep.equal(sensor);
    });

    it('must error NOT_FOUND when retrieving sensor with bad id', async () => {
      const res1 = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(sensorData);
      expect(res1.status).to.equal(STATUS.CREATED);
      expect(res1.body?.isOk).to.equal(true);

      const url2 = `${url}/${sensor.id}x`;
      const res2 = await ws.get(url2);
      expect(res2.status).to.equal(STATUS.NOT_FOUND);
      expect(res2.body?.isOk).to.equal(false);
      expect(res2.body.errors[0].options.code).to.equal('NOT_FOUND');
    });

    it('must error EXISTS on duplicate sensor', async () => {
      const res1 = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(sensorData);
      expect(res1.status).to.equal(STATUS.CREATED);
      expect(res1.body?.isOk).to.equal(true);
      const res2 = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(sensorData);
      expect(res2.status).to.equal(STATUS.CONFLICT);
      expect(res2.body?.isOk).to.equal(false);
      expect(res2.body.errors[0].options.code).to.equal('EXISTS');
    });

    it ('must error REQUIRED if missing required fields', async () => {
      for (const k of Object.keys(sensorData)) {
	const sensorData1 = {...sensorData};
	delete sensorData1[k];
	const res = await ws.put(url)
      	  .set('Content-Type', 'application/json')
          .send(sensorData1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	expect(res.body.errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it('must error BAD_VAL non-numeric min/max fields', async () => {
      for (const k of ['min', 'max']) {
	const sensorData1 = {...sensorData};
	sensorData1[k] += 'x';
	const res = await ws.put(url)
      	  .set('Content-Type', 'application/json')
          .send(sensorData1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	expect(res.body.errors[0].options.code).to.equal('BAD_VAL');
      }
    });
    
    it('must error BAD_RANGE when min > max error', async () => {
      const data = {...sensorData};
      [data.min, data.max] = [data.max, data.min];
      const res = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(data);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      const errors = res.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must error BAD_ID for bad sensor-type ID', async () => {
      const data = {...sensorData};
      data.sensorTypeId += 'x';
      const res = await ws.put(url)
      	.set('Content-Type', 'application/json')
        .send(data);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      const errors = res.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_ID');
    });

    it('must detect expected range inconsistent with sensor-type', async () => {
      for (const k of ['min', 'max']) {
	const data = {...sensorData};
	const inc = k === 'min' ? -1 : 1;
	data[k] = String(Number(DATA.SENSOR_TYPE1[k]) + inc);
	const res = await ws.put(url)
      	  .set('Content-Type', 'application/json')
          .send(data);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	const errors = res.body.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_RANGE');
      }
    });

  });

  describe('sensor reading add validity checks', () => {

    const url = `${BASE}/sensor-readings`;
    const reading1Data = DATA.SENSOR_READING1;
    let reading1: SensorReading;
  
    beforeEach(async () => {
      const reading1Result = SensorReading.make(reading1Data);
      assert(reading1Result.isOk === true);
      reading1 = reading1Result.val;
      const addResult1 = await sensorsInfo.addSensorType(DATA.SENSOR_TYPE1);
      assert(addResult1.isOk === true);
      const addResult2 = await sensorsInfo.addSensor(DATA.SENSOR1);
      assert(addResult2.isOk === true);
    });
 
    it('must successfully add a valid sensor reading', async () => {
      const res =
	await ws.put(url)
	  .set('Content-Type', 'application/json')
	  .send(reading1Data);
      expect(res.status).to.equal(STATUS.CREATED);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('PUT');
      expect(links?.self?.href).to.equal(url);
      expect(res.body.result).to.deep.equal(reading1);
    });

    it('must error EXISTS on duplicate sensor reading', async () => {
      const res1 =
	await ws.put(url)
	  .set('Content-Type', 'application/json')
	  .send(reading1Data);
      expect(res1.status).to.equal(STATUS.CREATED);
      expect(res1.body?.isOk).to.equal(true);
      const res2 =
	await ws.put(url)
	  .set('Content-Type', 'application/json')
	  .send(reading1Data);
      expect(res2.status).to.equal(STATUS.CONFLICT);
      expect(res2.body?.isOk).to.equal(false);
      expect(res2.body.errors[0].options.code).to.equal('EXISTS');
    });

    it ('must detect missing required fields', async () => {
      for (const k of Object.keys(reading1Data)) {
	const data1 = {...reading1Data};
	delete data1[k];
	const res =
	  await ws.put(url)
	    .set('Content-Type', 'application/json')
	    .send(data1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	expect(res.body.errors[0].options.code).to.equal('REQUIRED');
      }
    });

    it ('must detect an incorrect sensorId field', async () => {
      const data1 = {...reading1Data};
      data1.sensorId += 'x';
      const res =
	await ws.put(url)
	  .set('Content-Type', 'application/json')
	  .send(data1);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      const errors = res.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].options.code).to.equal('BAD_ID');
    });

    it('must detect non-numeric timestamp and value fields', async () => {
      for (const k of ['timestamp', 'value']) {
	const data1 = {...reading1Data};
	data1[k] += 'x';
	const res =
	  await ws.put(url)
	    .set('Content-Type', 'application/json')
	    .send(data1);
	expect(res.status).to.equal(STATUS.BAD_REQUEST);
	expect(res.body?.isOk).to.equal(false);
	const errors = res.body.errors;
	expect(errors).to.have.length(1);
	expect(errors[0].options.code).to.equal('BAD_VAL');
      }
    });

  });


  describe('sensor-types search', () => {

    const specs = SPECS['test-sensor-types'];
    const { sensorTypes: sensorTypesData } = DATA.testFindSensorTypes;
    let sensorTypes: SensorType[];

    beforeEach(async () => {
      const sensorsInfoResult =
	await addSensorsInfo(sensorTypesData, [], [], sensorsInfo);
      assert(sensorsInfoResult.isOk === true);
      sensorTypes = sensorTypesData
	.sort((s1: Record<string, string>, s2: Record<string, string>) =>
                 s1.id.localeCompare(s2.id))
	.map((s: Record<string, string>) => {
	  const sensorTypeResult = SensorType.make(s);
	  assert(sensorTypeResult.isOk === true);
	  return sensorTypeResult.val;
	});
    });

    async function findSensorTypes(query: Record<string, string>) {
      const res = await ws.get(`${BASE}/sensor-types`).query(query);
      expect(res.status).to.equal(STATUS.OK);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('GET');
      const rawResult: { result: any }[] = res.body?.result;
      const result = rawResult.map((r: { result: any }) => r.result);
      return { result, links, rawResult, };
    }
      
    it('must find all sensor types', async () => {
      const { result } = await findSensorTypes(FIND_ALL);
      expect(result).to.deep.equal(sensorTypes);
    });

    it('must find all sensor types sorted by id', async () => {
      const { result } = await findSensorTypes(FIND_ALL);
      expect(isSortedIds(result)).to.be.true;
    });
    
    it('must find all sensor types for a particular manufacturer', async () => {
      const query = { ...FIND_ALL, manufacturer: 'Honeywell' };
      const { result } = await findSensorTypes(query);
      const nExpectedResults = specs.nSensorTypes/specs.nManufacturers;
      expect(result).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown manufacturer', async () => {
      const { result } = await findSensorTypes({manufacturer: 'Honeywell1'});
      expect(result).to.have.length(0);
    });
    
    it('must find all sensor types for a particular quantity', async () => {
      const query = { ...FIND_ALL, quantity: 'pressure' };
      const { result } = await findSensorTypes(query);
      const nExpectedResults = specs.nSensorTypes/specs.nQuantities;
      expect(result).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown quantity', async () => {
      const { result } = await findSensorTypes({quantity: 'pressure1'});
      expect(result).to.have.length(0);
    });
    
    it('must find a single sensor type having a particular id', async () => {
      const { result } = await findSensorTypes({id: sensorTypes[0].id});
      expect(result).to.have.length(1);
    });

    it('must find sensor type using a non-indexed field', async () => {
      const query = { ...FIND_ALL, unit: sensorTypes[0].unit };
      const { result } = await findSensorTypes(query);
      expect(result).to.have.length(specs.nManufacturers);
    });

    it('must not find any sensor type having an invalid id', async () => {
      const { result } = await findSensorTypes({id: sensorTypes[0].id + 'x'});
      expect(result).to.have.length(0);
    });

    it('must find a single sensor type having a particular modelNumber',
       async () =>
    {
      const query = {modelNumber: sensorTypes[1].modelNumber};
      const { result } = await findSensorTypes(query);
      expect(result).to.have.length(1);
    });
    
    it('must find a single sensor type having a id and quantity', async () => {
      const { id, quantity } = sensorTypes[1];
      const { result } = await findSensorTypes({id, quantity});
      expect(result).to.have.length(1);
    });
    
    it('must not find type with inconsistent id and quantity', async () => {
      const { id, quantity } = sensorTypes[1];
      const qOther =
	sensorTypes.map(s => s.quantity).find(q => q !== quantity)!;
      const { result } = await findSensorTypes({id, quantity: qOther});
      expect(result).to.have.length(0);
    });
    
    it('must find first page of sensor types', async () => {
      assert(specs.nSensorTypes >= DEFAULT_COUNT);
      const { result } = await findSensorTypes({});
      expect(result).to.have.length(DEFAULT_COUNT);
    });
    
    it('must find next three results after first page of results', async () => {
      const nResults = 3;
      assert(specs.nSensorTypes >= DEFAULT_COUNT + nResults);
      const query = {index: String(DEFAULT_COUNT), count: String(nResults) };
      const { result } = await findSensorTypes(query);
      expect(result).to.have.length(nResults);
      const expected = sensorTypesData
	.sort((a, b) => a.id.localeCompare(b.id))
	.slice(DEFAULT_COUNT, DEFAULT_COUNT + nResults)
	.map(req => {
	  const r = SensorType.make(req);
	  assert(r.isOk === true);
	  return r.val;
	});
      expect(result).to.deep.equal(expected);
    });        
    
  });

  describe('sensors search', () => {

    const specs = SPECS['test-sensors'];
    const { sensorTypes, sensors, sensorReadings } = DATA.testFindSensors;

    beforeEach(async () => {
      const addResult =
	await addSensorsInfo(sensorTypes, sensors, [], sensorsInfo);
      assert(addResult.isOk === true);
    });

    async function findSensors(query: Record<string, string>) {
      const res = await ws.get(`${BASE}/sensors`).query(query);
      expect(res.status).to.equal(STATUS.OK);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('GET');
      const rawResult: { result: any }[] = res.body?.result;
      const result = rawResult.map((r: { result: any }) => r.result);
      return { result, links, rawResult, };
    }
      
    it('must find all sensors', async () => {
      const { result } = await findSensors(FIND_ALL);
      const nExpectedResults = specs.nSensorTypes*specs.nSensorsPerSensorType;
      expect(result).to.have.length(nExpectedResults);
    });

    it('must find all sensors sorted by id', async () => {
      const { result } = await findSensors(FIND_ALL);
      expect(isSortedIds(result)).to.be.true;
    });
    
    it('must find all sensors having a particular sensorTypeId', async () => {
      const query = { ...FIND_ALL, sensorTypeId: sensorTypes[0].id }
      const { result } = await findSensors(query);
      const nExpectedResults = specs.nSensorsPerSensorType;
      expect(result).to.have.length(nExpectedResults);
    });
    
    it('must find no sensor types for an unknown sensorTypeId', async () => {
      const { result } =
	await findSensors({sensorTypeId: sensorTypes[0].id + 'x'});
      expect(result).to.have.length(0);
    });

    it('must find a single sensor having a particular id', async () => {
      const { result } = await findSensors({id: sensors[0].id});
      expect(result).to.have.length(1);
    });

    it('must not find any sensor having an invalid id', async () => {
      const { result } = await findSensors({id: sensors[0].id + 'x'});
      expect(result).to.have.length(0);
    });
    
    it('must find a single sensor having an id and sensorTypeId', async () => {
      const { id, sensorTypeId } = sensors[1];
      const { result } = await findSensors({id, sensorTypeId});
      expect(result).to.have.length(1);
    });
    
    it('must not find type with inconsistent id and sensorTypeId', async () => {
      const {id, sensorTypeId} = sensors[1];
      const sOther =
	sensors.map(s => s.sensorTypeId).find(id => id !== sensorTypeId)!;
      const { result } = await findSensors({id, sensorTypeId: sOther});
      expect(result).to.have.length(0);
    });

    it('must find first page of sensors', async () => {
      const nSensors = specs.nSensorTypes*specs.nSensorsPerSensorType;
      assert(nSensors >= DEFAULT_COUNT);
      const { result } = await findSensors({});
      expect(result).to.have.length(DEFAULT_COUNT);
    });
    
    it('must find next three results after first page of results', async () => {
      const nResults = 3;
      const nSensors = specs.nSensorTypes*specs.nSensorsPerSensorType;
      assert(nSensors >= DEFAULT_COUNT + nResults);
      const query = {index: String(DEFAULT_COUNT), count: String(nResults) };
      const { result } = await findSensors(query);
      expect(result).to.have.length(nResults);
      const expected = sensors.sort((a, b) => a.id.localeCompare(b.id))
	.slice(DEFAULT_COUNT, DEFAULT_COUNT + nResults)
	.map(req => {
	  const r = Sensor.make(req);
	  assert(r.isOk === true);
	  return r.val;
	});
      expect(result).to.deep.equal(expected);
    });

  });

  describe('sensor readings search', () => {

    const url = `${BASE}/sensor-readings`;
    const specs = SPECS['test-sensor-readings'];
    const { sensorTypes, sensors, sensorReadings } =
      DATA.testFindSensorReadings;

    beforeEach(async () => {
      const addResult =
	await addSensorsInfo(sensorTypes, sensors, sensorReadings, sensorsInfo);
      assert(addResult.isOk === true);
    });

    async function findOkReading(query: Record<string, string>) {
      const res = await ws.get(url).query(query);
      expect(res.status).to.equal(STATUS.OK);
      expect(res.body?.isOk).to.equal(true);
      const links = res.body?.links;
      expect(links?.self?.method).to.equal('GET');
      const rawResult: { result: any }[] = res.body?.result;
      const result = rawResult.map((r: { result: any }) => r.result);
      return { result, links, rawResult, };
    }
 
    it('must error on missing sensorId', async () => {
      const query = {value: '2'};
      const res = await ws.get(url).query(query);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      expect(res.body.errors[0].options.code).to.equal('REQUIRED');
    });

    it('must error on invalid timestamp range', async () => {
      const sensorId = sensors[0].id;
      const search = { sensorId, minTimestamp: '2', maxTimestamp: '1' };
      const res = await ws.get(url).query(search);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      expect(res.body.errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must error on invalid value range', async () => {
      const sensorId = sensors[0].id;
      const search = { sensorId, minValue: '2', maxValue: '1' };
      const res = await ws.get(url).query(search);
      expect(res.status).to.equal(STATUS.BAD_REQUEST);
      expect(res.body?.isOk).to.equal(false);
      expect(res.body.errors[0].options.code).to.equal('BAD_RANGE');
    });

    it('must find all sensor readings for a particular sensor', async () => {
      const sensorId = sensors[0].id;
      const query = { ...FIND_ALL, sensorId };
      const { result } = await findOkReading(query);
      const nExpectedResults = specs.nReadingsPerSensor;
      expect(result).to.have.length(nExpectedResults);
    });

    it('must find all sensor readings sorted numerically by timestamp',
       async () =>
    {
      const sensorId = sensors[0].id;
      const query = { ...FIND_ALL, sensorId };
      const { result } = await findOkReading(query);
      expect(isSortedTimestamps(result)).to.be.true;
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
      const query = { ...FIND_ALL, sensorId, minTimestamp, maxTimestamp };
      const { result } = await findOkReading(query);
      expect(result).to.have.length(n);
    });

    it('must find all sensor readings having a particular value', async () => {
      const {id: sensorId} = sensors[0];
      const value = String(specs.limitsRangeLo);
      const [minValue, maxValue] = [value, value];
      const query = { ...FIND_ALL, sensorId, minValue, maxValue };
      const { result } = await findOkReading(query);
      const nExpectedResults =
	specs.nReadingsPerSensor/(2*specs.rangeAroundNominalValue + 1)
      expect(result).to.have.length(nExpectedResults);
    });

    it('must find all sensor readings greater than a particular value',
       async () =>
    {
      const {id: sensorId} = sensors[0];
      const { nReadingsPerSensor: n, limitsRangeLo: lo,
	      rangeAroundNominalValue: range } = specs;
      const minValue = String(Number(lo) - Number(range) + 1);
      const query = { ...FIND_ALL, sensorId, minValue };
      const { result } = await findOkReading(query);
      const nExpectedResults = n - n/(2*range + 1);
      expect(result).to.have.length(nExpectedResults);
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
      const query = {
	...FIND_ALL, sensorId, minValue, maxValue, minTimestamp, maxTimestamp,
      };
      const { result } = await findOkReading(query);
      const nExpectedResults = n/(2*range + 1) - 2;
      expect(result).to.have.length(nExpectedResults);
    });

    it('must find first page of sensor readings', async () => {
      const nReadings = specs.nReadingsPerSensor;
      assert(nReadings >= DEFAULT_COUNT);
      const sensorId = sensors[0].id;
      const { result } = await findOkReading({sensorId});
      expect(result).to.have.length(DEFAULT_COUNT);
    });
    
    it('must find next three results after first page of results', async () => {
      const nResults = 3;
      const nReadings = specs.nReadingsPerSensor;
      assert(nReadings >= DEFAULT_COUNT + nResults);
      const sensorId = sensors[0].id;
      const query = {
	sensorId, index: String(DEFAULT_COUNT), count: String(nResults)
      };
      const { result } = await findOkReading(query);
      expect(result).to.have.length(nResults);
      const expected = sensorReadings.filter(r => r.sensorId === sensorId).
	sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
	.slice(DEFAULT_COUNT, DEFAULT_COUNT + nResults)
	.map(req => {
	  const r = SensorReading.make(req);
	  assert(r.isOk === true);
	  return r.val;
	});
      expect(result).to.deep.equal(expected);
    });

  });
  
});

const FIND_ALL = { index: '0', count: String(Number.MAX_SAFE_INTEGER) };


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

