import { Errors, Checkers } from 'cs544-js-utils';

type FlatReq = Checkers.FlatReq;
type FlatReqChecks = Checkers.FlatReqChecks;
type Checked<T> = Checkers.Checked<T>;

const { checkFlatReq, makeRegexChkFn } = Checkers;

/****************************** Validation *****************************/

const NUMBER_CHK = makeRegexChkFn(/^[-+]?\d+(\.\d*)?$/,
				  '"$[0]" must be a number');

const INTEGER_CHK =
  makeRegexChkFn(/^\d+$/, '"$[0]" must be a non-negative integer');

/** Validate req[minId] <= req[maxId] */
function rangeChk(minId: string, maxId: string) {
  const msg = 'The value of "$[0]" must be less than that of "$[1]"';
  const errRet: [string, string] = [ msg, 'BAD_RANGE' ];
  const chk = (req: FlatReq) =>
    !(Number(req[minId] ?? -Infinity) <= Number(req[maxId] ?? Infinity))
    && errRet;
  return { chk, fieldIds: [minId, maxId] };
}


const FIND_VALIDATION_INFO: Record<string, FlatReqChecks> = {

  findSensorTypes: {
    fields: {
      id: { default: null },
      manufacturer: { default: null },
      modelNumber: { default: null },
      quantity: { default: null },
      unit: { default: null },
    },
  },
  
  findSensors: {
    fields: {
      id: { default: null},
      sensorTypeId: { default: null},
    },
  },

  findSensorReadings: {
    fields: {
      sensorId: { },
      minTimestamp: { default: null, chk: INTEGER_CHK },
      maxTimestamp: { default: null, chk: INTEGER_CHK },
      minValue: { default: null, chk: NUMBER_CHK },
      maxValue: { default: null, chk: NUMBER_CHK },
    },
    chk: [
      rangeChk('minTimestamp', 'maxTimestamp'),
      rangeChk('minValue', 'maxValue'),
    ],
  },

  
};

type FindCommand = keyof typeof FIND_VALIDATION_INFO;

export function validateFindCommand(cmd: FindCommand, req: FlatReq)
  : Errors.Result<Checked<FlatReq>> 
{
  return checkFlatReq(req, FIND_VALIDATION_INFO[cmd]);
}

/***************************** Sensor Types ****************************/

type Integer = number;
type Timestamp = Integer;

type SensorTypeId = string;
export type SensorType = {
  id: SensorTypeId;
  manufacturer: string;
  modelNumber: string;
  quantity: string;
  unit: string;
  limits: Range;   //inclusive bounds
};

const  ADD_SENSOR_TYPE_CHECKS = {
  fields: {
    id: { },
    manufacturer: { },
    modelNumber: { },
    quantity: { },
    unit: { },
    min: { chk: NUMBER_CHK },
    max: { chk: NUMBER_CHK },
  },
  chk: rangeChk('min', 'max'),
};

export function makeSensorType(req: FlatReq) : Errors.Result<SensorType> {
  const validResult: Errors.Result<Checked<FlatReq>> =
    checkFlatReq(req, ADD_SENSOR_TYPE_CHECKS);
  if (!validResult.isOk) return validResult;
  const sensorType = {
    id: req.id,
    manufacturer: req.manufacturer,
    modelNumber: req.modelNumber,
    quantity: req.quantity,
    unit: req.unit,
    limits: new Range(Number(req.min), Number(req.max)),
  };
  return Errors.okResult(sensorType);
}

/******************************** Sensors ******************************/

type SensorId = string;
export type Sensor = {
  id: SensorId;
  sensorTypeId: SensorTypeId;
  period: Integer;
  expected: Range;  //inclusive bounds
};

const ADD_SENSOR_CHECKS = {
  fields: {
    id: { },
    sensorTypeId: { },
    period: { chk: INTEGER_CHK },
    min: { name: 'min expected', chk: NUMBER_CHK },
    max: { name: 'max expected', chk: NUMBER_CHK },
  },
  chk: rangeChk('min', 'max'),
};

export function makeSensor(req: FlatReq) : Errors.Result<Sensor> {
  const validResult: Errors.Result<Checked<FlatReq>> =
    checkFlatReq(req, ADD_SENSOR_CHECKS);
  if (!validResult.isOk) return validResult;
  const sensor = {
    id: req.id,
    sensorTypeId: req.sensorTypeId,
    period: Number(req.period),
    expected: new Range(Number(req.min), Number(req.max)),
  };
  return Errors.okResult(sensor);
}

/**************************** Sensor Reading ***************************/

export type SensorReading = {
  sensorId: string;
  timestamp: Timestamp;
  value: number;
};

const ADD_SENSOR_READING_CHECKS = {
  fields: {
    sensorId: { },
    timestamp: { chk: INTEGER_CHK },
    value: { chk: NUMBER_CHK },
  },
};

export function makeSensorReading(req: FlatReq) : Errors.Result<SensorReading> {
  const validResult: Errors.Result<Checked<FlatReq>> =
    checkFlatReq(req, ADD_SENSOR_READING_CHECKS);
  if (!validResult.isOk) return validResult;
  const sensorReading = {
    sensorId: req.sensorId,
    timestamp: Number(req.timestamp),
    value: Number(req.value),
  };
  return Errors.okResult(sensorReading);
}

/******************************* Utilities *****************************/

export class Range {
  //inclusive bounds
  readonly min: number;
  readonly max: number;

  constructor(min: number, max: number) { this.min = min; this.max = max; }

  isWithin(val: number) { return this.min <= val && val <= this.max; }
  isSubrange(superRange: Range) {
    return superRange.min <= this.min && this.max <= superRange.max;
  }

}


