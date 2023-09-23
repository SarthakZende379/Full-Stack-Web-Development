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
      return Errors.errResult('BAD_ID', 'Bad sensorTypeId'); 
    }
    this.sensors[sensor.id] = sensor;
    return Errors.okResult([sensor]);
  }    
  
  addSensorReading(req: Record<string, string>): Errors.Result<SensorReading[]> {
    const sensorReadingResult = makeSensorReading(req);
    if (!sensorReadingResult.isOk) return sensorReadingResult;
    const sensorReading = sensorReadingResult.val;
    if (!this.sensors[sensorReading.sensorId]) {
      return Errors.errResult('BAD_ID', 'Bad sensorId'); 
    }

    if (!this.sensorReadings[sensorReading.sensorId]) {
      this.sensorReadings[sensorReading.sensorId] = [];
    }

    // Replace any existing reading with the same timestamp
    const existingReadings = this.sensorReadings[sensorReading.sensorId];
    const index = existingReadings.findIndex((r: SensorReading) => r.timestamp === sensorReading.timestamp);
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
  
    // Create an array to store filtered sensor types
    const filteredTypes: SensorType[] = [];
  
    // Iterate through all sensor types and filter based on query parameters
    for (const sensorType of Object.values(this.sensorTypes)) {
      let match = true;
  
      // Check if each query parameter matches the corresponding field in the sensor type
      for (const [key, value] of Object.entries(req)) {
        // Ignore unknown fields
        if (!(key in sensorType)) {
          continue;
        }
  
        if (sensorType[key as keyof SensorType] !== value) {
          match = false;
          break; // If any parameter doesn't match, no need to check further
        }
      }
  
      if (match) {
        filteredTypes.push(sensorType);
      }
    }
  
    return Errors.okResult(filteredTypes);
  }
  

  findSensors(req: FlatReq): Errors.Result<Sensor[]> {
    const validResult: Errors.Result<Checked<FlatReq>> = validateFindCommand('findSensors', req);
    if (!validResult.isOk) return validResult;

    // Create an array to store filtered sensors
    const filteredSensors: Sensor[] = [];

    // Iterate through all sensors and filter based on query parameters
    for (const sensor of Object.values(this.sensors)) {
      let match = true;

      // Check if each query parameter matches the corresponding field in the sensor
      for (const [key, value] of Object.entries(req)) {
        // Ignore unknown fields
        if (!(key in sensor)) {
          continue;
        }

        if (sensor[key as keyof Sensor] !== value) {
          match = false;
          break; // If any parameter doesn't match, no need to check further
        }
      }

      if (match) {
        filteredSensors.push(sensor);
      }
    }

    return Errors.okResult(filteredSensors);
  }

  findSensorReadings(req: FlatReq): Errors.Result<SensorReading[]> {
    const validResult: Errors.Result<Checked<FlatReq>> = validateFindCommand('findSensorReadings', req);
    if (!validResult.isOk) return validResult;

    // Create an array to store filtered sensor readings
    const filteredReadings: SensorReading[] = [];

    // Iterate through all sensor readings and filter based on query parameters
    for (const readings of Object.values(this.sensorReadings)) {
      for (const reading of readings) {
        let match = true;

        // Check if each query parameter matches the corresponding field in the sensor reading
        for (const [key, value] of Object.entries(req)) {
          // Ignore unknown fields
          if (!(key in reading)) {
            continue;
          }

          if (key === 'timestamp') {
            const timestampValue = parseFloat(value);
            if (isNaN(timestampValue)) {
              match = false;
              break;
            }

            // Compare as numbers, converting to string where necessary
            if (req['comparison'] === 'greater' && !(reading.timestamp > timestampValue)) {
              match = false;
              break;
            } else if (req['comparison'] === 'within' && !(reading.timestamp >= timestampValue && reading.timestamp <= parseFloat(req['endtime'] || '0'))) {
              match = false;
              break;
            }
          } else if (reading[key as keyof SensorReading] !== value) {
            match = false;
            break; // If any parameter doesn't match, no need to check further
          }
        }

        if (match) {
          filteredReadings.push(reading);
        }
      }
    }

    return Errors.okResult(filteredReadings);
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
  // Add sensor types
  for (const req of sensorTypes) {
    const result = sensorsInfo.addSensorType(req);
    if (!result.isOk) return result;
  }

  // Add sensors
  for (const req of sensors) {
    const result = sensorsInfo.addSensor(req);
    if (!result.isOk) return result;
  }

  // Add sensor readings
  for (const req of sensorReadings) {
    const result = sensorsInfo.addSensorReading(req);
    if (!result.isOk) return result;
  }

  return Errors.okResult(undefined);
}

/****************************** Utilities ******************************/

// TODO: Add any utility functions or classes here
