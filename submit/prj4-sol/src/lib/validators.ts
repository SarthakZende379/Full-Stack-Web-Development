import { Errors, Checkers } from 'cs544-js-utils';

type FlatReq = Checkers.FlatReq;
type FlatReqChecks = Checkers.FlatReqChecks;
type Checked<T> = Checkers.Checked<T>;

const { checkFlatReq, makeRegexChkFn } = Checkers;

/*************************** General Validators ************************/

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

const PAGING_FIELDS = {
  count: {
    chk: NUMBER_CHK,
    default: null,
  },
  index: {
    chk: NUMBER_CHK,
    default: null,
  },
};

/***************************** Sensor Types ****************************/

type Integer = number;
type Timestamp = Integer;

type SensorTypeId = string;
export class SensorType {
  constructor(readonly id: SensorTypeId,
	      readonly manufacturer: string,
	      readonly modelNumber: string,
	      readonly quantity: string,
	      readonly unit: string,
	      readonly limits: Range /*inclusive bounds*/ ) {
  }

  static make(req: FlatReq) : Errors.Result<SensorType> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, ADD_SENSOR_TYPE_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensorType =
      new SensorType(req.id, req.manufacturer, req.modelNumber, req.quantity,
		     req.unit, new Range(Number(req.min), Number(req.max)));
    return Errors.okResult(sensorType);
  }

}

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


/******************************** Sensors ******************************/

type SensorId = string;
export class Sensor {
  constructor(readonly id: SensorId,
	      readonly sensorTypeId: SensorTypeId,
	      readonly period: Integer,
	      readonly expected: Range /*inclusive bounds */ ) {
  }

  static make(req: FlatReq) : Errors.Result<Sensor> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, ADD_SENSOR_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensor = new Sensor(req.id, req.sensorTypeId, Number(req.period),
			      new Range(Number(req.min), Number(req.max)));
    return Errors.okResult(sensor);
  }
  
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


/**************************** Sensor Reading ***************************/

export class SensorReading {
  constructor(readonly sensorId: string,
	      readonly timestamp: Timestamp,
	      readonly value: number) {
  }
  
  static make(req: FlatReq) : Errors.Result<SensorReading> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, ADD_SENSOR_READING_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensorReading =
      new SensorReading(req.sensorId, Number(req.timestamp), Number(req.value));
    return Errors.okResult(sensorReading);
  }
  
};

const ADD_SENSOR_READING_CHECKS = {
  fields: {
    sensorId: { },
    timestamp: { chk: INTEGER_CHK },
    value: { chk: NUMBER_CHK },
  },
};

/************************** Sensor Type Search *************************/

export class SensorTypeSearch {
  readonly id?: SensorTypeId;
  readonly manufacturer?: string;
  readonly modelNumber?: string;
  readonly quantity?: string;
  readonly unit?: string;
  readonly count?: number;
  readonly index?: number;

  constructor(req: Checked<FlatReq>) {
    for (const k of ['id', 'manufacturer', 'modelNumber', 'quantity', 'unit']) {
      this[k as keyof Omit<SensorTypeSearch, 'count'|'index'>] = req[k];
    }
    if (req.count) this.count = Number(req.count);
    if (req.index) this.index = Number(req.index);
  }

  static make(req: FlatReq) : Errors.Result<SensorTypeSearch> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, SENSOR_TYPE_SEARCH_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensorTypeSearch = new SensorTypeSearch(validResult.val);
    return Errors.okResult(sensorTypeSearch);
  }

};

const SENSOR_TYPE_SEARCH_CHECKS = {
  fields: {
    id: { default: null },
    manufacturer: { default: null },
    modelNumber: { default: null },
    quantity: { default: null },
    unit: { default: null },
    ...PAGING_FIELDS,
  },
};

/**************************** Sensor Search ****************************/

export class SensorSearch {
  readonly id?: SensorId;
  readonly sensorTypeId?: SensorTypeId;
  readonly count?: number;
  readonly index?: number;

  constructor(req: Checked<FlatReq>) {
    if (req.id) this.id = req.id;
    if (req.sensorTypeId) this.sensorTypeId = req.sensorTypeId;
    if (req.count) this.count = Number(req.count);
    if (req.index) this.index = Number(req.index);
  }

  static make(req: FlatReq) : Errors.Result<SensorSearch> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, SENSOR_SEARCH_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensorSearch = new SensorSearch(validResult.val);
    return Errors.okResult(sensorSearch);
  }
  
}

const SENSOR_SEARCH_CHECKS = {
  fields: {
    id: { default: null},
    sensorTypeId: { default: null},
    ...PAGING_FIELDS,
  },
};

/************************* Sensor Reading Search ***********************/

export class SensorReadingSearch {
  readonly sensorId: string;
  readonly minTimestamp: Timestamp;
  readonly maxTimestamp: Timestamp;
  readonly minValue: number;
  readonly maxValue: number;
  readonly count?: number;
  readonly index?: number;

  constructor(req: Checked<FlatReq>) {
    this.sensorId = req.sensorId;
    this.minTimestamp =
      (req.minTimestamp !== undefined) ? Number(req.minTimestamp) : -Infinity;
    this.maxTimestamp =
      (req.maxTimestamp !== undefined) ? Number(req.maxTimestamp) : +Infinity;
    this.minValue =
      (req.minValue !== undefined) ? Number(req.minValue) : -Infinity;
    this.maxValue =
      (req.maxValue !== undefined) ? Number(req.maxValue) : +Infinity;
    if (req.count) this.count = Number(req.count);
    if (req.index) this.index = Number(req.index);
  }

  static make(req: FlatReq) : Errors.Result<SensorReadingSearch> {
    const validResult: Errors.Result<Checked<FlatReq>> =
      checkFlatReq(req, SENSOR_READING_SEARCH_CHECKS);
    if (!validResult.isOk) return validResult;
    const sensorReadingSearch = new SensorReadingSearch(validResult.val);
    return Errors.okResult(sensorReadingSearch);
  }

};


const SENSOR_READING_SEARCH_CHECKS =  {
  fields: {
    sensorId: { },
    minTimestamp: { default: null, chk: INTEGER_CHK },
    maxTimestamp: { default: null, chk: INTEGER_CHK },
    minValue: { default: null, chk: NUMBER_CHK },
    maxValue: { default: null, chk: NUMBER_CHK },
    ...PAGING_FIELDS,
  },
  chk: [
    rangeChk('minTimestamp', 'maxTimestamp'),
    rangeChk('minValue', 'maxValue'),
  ],
};


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


