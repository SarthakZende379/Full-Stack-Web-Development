import { Checkers } from 'cs544-js-utils';

import { makeData } from './make-data.js';

import { Range } from '../../lib/validators.js';

const SENSOR_TYPE1: Checkers.FlatReq = {
  id: 'hw123',
  manufacturer: 'honeywell',
  modelNumber: '123',
  quantity: 'pressure',
  unit: 'PSI',
  min: '10.0',
  max: '100'
};

const SENSOR_TYPE1_VAL = {
  id: 'hw123',
  manufacturer: 'honeywell',
  modelNumber: '123',
  quantity: 'pressure',
  unit: 'PSI',
  limits: new Range(10.0, 100),
};

const SENSOR1: Checkers.FlatReq = {
  id: 'ln1120',
  sensorTypeId: 'hw123',
  period: '1000',
  min: '15',
  max: '85'
};

const SENSOR1_VAL = {
  id: 'ln1120',
  sensorTypeId: 'hw123',
  period: 1000,
  expected: new Range(15, 85),
};

const SENSOR_READING1: Checkers.FlatReq = {
  sensorId: 'ln1120',
  timestamp: '1694129048',
  value: '12.4'
}

const SENSOR_READING1_VAL = {
  sensorId: 'ln1120',
  timestamp: 1694129048,
  value: 12.4
}

const DATA = {
  SENSOR_TYPE1, SENSOR1, SENSOR_READING1,
  SENSOR_TYPE1_VAL, SENSOR1_VAL, SENSOR_READING1_VAL,
  testFindSensorTypes: makeData('test-sensor-types'),
  testFindSensors: makeData('test-sensors'),
  testFindSensorReadings: makeData('test-sensor-readings'),
};

export default DATA;
