import { Errors, Checkers } from 'cs544-js-utils';
import { validateFindCommand, SensorType, Sensor, SensorReading, makeSensorType, makeSensor, makeSensorReading } from './validators.js';

type FlatReq = Checkers.FlatReq; // dictionary mapping strings to strings

// marks T as having been run through validate()
type Checked<T> = Checkers.Checked<T>;

/*********************** Top Level Sensors Info ************************/

export class SensorsInfo {
  private sensorTypes: Record<string, SensorType> = {};
  private sensors: Record<string, Sensor> = {};
  private sensorReadings: Record<string, SensorReading[]> = {};

  constructor() {
    // TODO: Initialize any data structures or settings here
  }

  clear(): Errors.Result<string[]> {
    // Clear all sensor data
    this.sensorTypes = {};
    this.sensors = {};
    this.sensorReadings = {};
    return Errors.okResult([]);
  }

  addSensorType(req: Record<string, string>): Errors.Result<SensorType[]> {
    const sensorTypeResult = makeSensorType(req);
    if (!sensorTypeResult.isOk) return sensorTypeResult;
    const sensorType = sensorTypeResult.val;
    this.sensorTypes[sensorType.id] = sensorType;
    return Errors.okResult([sensorType]);
  }

  addSensor(req: Record<string, string>): Errors.Result<Sensor[]> {
    const sensorResult = makeSensor(req);
    if (!sensorResult.isOk) return sensorResult;
    const sensor = sensorResult.val;
    if (!this.sensorTypes[sensor.sensorTypeId]) {
      return Errors.errResult('BAD_ID', 'Unknown sensorTypeId');
    }
    this.sensors[sensor.id] = sensor;
    return Errors.okResult([sensor]);
  }

  addSensorReading(req: Record<string, string>): Errors.Result<SensorReading[]> {
    const sensorReadingResult = makeSensorReading(req);
    if (!sensorReadingResult.isOk) return sensorReadingResult;
    const sensorReading = sensorReadingResult.val;
    if (!this.sensors[sensorReading.sensorId]) {
      return Errors.errResult('BAD_ID', 'Unknown sensorId');
    }

    if (!this.sensorReadings[sensorReading.sensorId]) {
      this.sensorReadings[sensorReading.sensorId] = [];
    }

    // Replace any existing reading with the same timestamp
    const existingReadings = this.sensorReadings[sensorReading.sensorId];
    const index = existingReadings.findIndex((r) => r.timestamp === sensorReading.timestamp);
    if (index !== -1) {
      existingReadings[index] = sensorReading;
    } else {
      existingReadings.push(sensorReading);
    }

    return Errors.okResult([sensorReading]);
  }

  findSensorTypes(req: FlatReq): Errors.Result<SensorType[]> {
    const validResult: Errors.Result<Checked<FlatReq>> = validateFindCommand('findSensorTypes', req);
    if (!validResult.isOk) return validResult;
    
    // const filteredTypes = Object.values(this.sensorTypes).filter((sensorType) =>
    //   Object.entries(req).every(([key, value]) => sensorType[key] === value)
    // );

    // return Errors.okResult(filteredTypes);
    return Errors.okResult([]);
  }

  findSensors(req: FlatReq): Errors.Result<Sensor[]> {
    // Similar implementation to findSensorTypes
    return Errors.okResult([]);
  }

  findSensorReadings(req: FlatReq): Errors.Result<SensorReading[]> {
    // Similar implementation to findSensorTypes
    return Errors.okResult([]);
  }
}

/*********************** SensorsInfo Factory Functions *****************/

export function makeSensorsInfo(sensorTypes: FlatReq[] = [], sensors: FlatReq[] = [], sensorReadings: FlatReq[] = []): Errors.Result<SensorsInfo> {
  const sensorsInfo = new SensorsInfo();
  const addResult = addSensorsInfo(sensorTypes, sensors, sensorReadings, sensorsInfo);
  return addResult.isOk ? Errors.okResult(sensorsInfo) : addResult;
}

export function addSensorsInfo(
  sensorTypes: FlatReq[],
  sensors: FlatReq[],
  sensorReadings: FlatReq[],
  sensorsInfo: SensorsInfo
): Errors.Result<void> {
  // Similar implementation to your existing code
  return Errors.VOID_RESULT;
}

/****************************** Utilities ******************************/

// TODO: Add any utility functions or classes here

