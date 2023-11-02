/** Build synthetic data for testing */

const MANUFACTURER_PREFIXES = {
  'General Electric': 'GE-',
  'Honeywell': 'HW-',
};

const QUANTITY_UNITS = {
  //# of units for each quantity must be the same
  temperature: [ 'C', 'F', ],
  pressure: [ 'PSI', 'Pa', ],
  velocity: [ 'meters/sec', 'cm/sec', ],
};



const TIME_START = 'Sep 1, 2023';
export const TIME_START_SECS =
  Math.trunc((new Date(TIME_START).valueOf()/1000)/1000)*1000;
const PERIODS = [10, 20, 30];

//[lo, hi]: inclusive lo, exclusive hi
type RandBounds = [ number, number ];

type Spec = {
  nManufacturers: number,
  nPeriods: number,
  nQuantities: number,
  nUnitsPerQuantity: number,
  nSensorTypes: number,
  nSensorsPerSensorType: number,
  nReadingsPerSensor: number,
  limitsRangeLo: number,
  limitsRangeHi: number,
  limitsRandBounds: RandBounds,
  expectedRangeLo: number,
  expectedRangeHi: number,
  expectedRandBounds: RandBounds,
  rangeAroundNominalValue: number,
  valueStep: number,
  valueRandBounds: RandBounds,
  startTimeRands: RandBounds,
};

const BASE_SPEC  = {
  nManufacturers: Object.keys(MANUFACTURER_PREFIXES).length,
  nPeriods: PERIODS.length,
  nQuantities: Object.keys(QUANTITY_UNITS).length,
  nUnitsPerQuantity: Object.values(QUANTITY_UNITS)[0].length,
  nSensorTypes: 20,
  nSensorsPerSensorType: 10,
  nReadingsPerSensor: 10,
  limitsRangeLo: 10,
  limitsRangeHi: 100,
  expectedRangeLo: 20,
  expectedRangeHi: 90,
  rangeAroundNominalValue: 5,
  valueStep: 1,
  limitsRandBounds: [0, 0] as RandBounds,
  expectedRandBounds: [0, 0] as RandBounds,
  valueRandBounds: [0, 0] as RandBounds,
  startTimeRands: [0, 0] as RandBounds,
};

//used for generating test data
const TEST_SENSOR_TYPES_SPEC = {
  ...BASE_SPEC,
  nSensorTypes: 12,  //2 for each type of quantity/unit combination
  nSensorsPerSensorType: 0,
  nReadingsPerSensor: 0,
};

const TEST_SENSORS_SPEC = {
  ...BASE_SPEC,
  nSensorTypes: 4,
  nSensorsPerSensorType: 5,
  nReadingsPerSensor: 0,
};

const TEST_SENSOR_READINGS_SPEC = {
  ...BASE_SPEC,
  nSensorTypes: 1,
  nSensorsPerSensorType: 1,
  nReadingsPerSensor: 20,
  rangeAroundNominalValue: 2,
};

const RANDOM_SPEC = {
  ...BASE_SPEC,
  limitsRandBounds: [-4, 4] as RandBounds,
  expectedRandBounds: [-4, 4] as RandBounds,
  valueRandBounds: [-4, 4] as RandBounds,
  startTimeRands: [0, 15] as RandBounds,
};

export const SPECS : Record<string, Spec> = {
  'test-sensor-types': TEST_SENSOR_TYPES_SPEC,
  'test-sensors': TEST_SENSORS_SPEC,
  'test-sensor-readings': TEST_SENSOR_READINGS_SPEC,
  random: RANDOM_SPEC,
};

type SpecStr = keyof typeof SPECS;
type FlatData = Record<string, string>;

type Data = {
  sensorTypes: FlatData[];
  sensors: FlatData[];
  sensorReadings: FlatData[];
};


export function makeData(spec: Spec|SpecStr) : Data {
  if (typeof spec === 'string') spec = SPECS[spec];
  const sensorTypes = makeSensorTypes(spec);
  const sensors = makeSensors(spec, sensorTypes);
  const sensorReadings = makeSensorReadings(spec, sensors);
  return { sensorTypes, sensors, sensorReadings };
}

function makeSensorTypes(spec: Spec) {
  const {nSensorTypes, limitsRangeLo, limitsRangeHi, limitsRandBounds } = spec;
  const sensorTypes: FlatData[] = [];
  let modelIndex = 100;
  const qtyUnits = Object.entries(QUANTITY_UNITS)
    .map(([qty, units]) => units.map(u => [qty, u]))
    .flat(1);
  let qtyUnitsIndex = 0;
  const manPrefixPairs = Object.entries(MANUFACTURER_PREFIXES);
  let mppIndex = 0;
  for (let s = 0; s < nSensorTypes; s++) {
    const [manufacturer, prefix] = manPrefixPairs[mppIndex];
    mppIndex = (mppIndex + 1) % manPrefixPairs.length;
    const modelNumber = `${prefix}${modelIndex++}`;
    const id = modelNumber.replace(/\W+/g, '').toLowerCase();
    const [ quantity, unit ] = qtyUnits[qtyUnitsIndex];
    qtyUnitsIndex = (qtyUnitsIndex + 1) % qtyUnits.length;
    const min = String(limitsRangeLo + randInt(...limitsRandBounds));
    const max = String(limitsRangeHi + randInt(...limitsRandBounds));
    const sensorType = {
      id, manufacturer, modelNumber, quantity, unit, min, max,
    };
    sensorTypes.push(sensorType);
  }
  sensorTypes.sort((s1, s2) => s2.id.localeCompare(s1.id));
  return sensorTypes;
}

function makeSensors(spec: Spec, sensorTypes: FlatData[]) : FlatData[] {
  const {nSensorsPerSensorType,
	 expectedRangeLo, expectedRangeHi, expectedRandBounds } = spec;
  const sensors: FlatData[] = [];
  let p = 0;
  let idIndex = 100;
  for (const sensorType of sensorTypes) {
    const sensorTypeId = sensorType.id;
    for (let i = 0; i < nSensorsPerSensorType; i++) {
      const id = `s${idIndex++}`;
      const period = String(PERIODS[p]);
      p = (p + 1)%PERIODS.length;
      const min = String(expectedRangeLo + randInt(...expectedRandBounds));
      const max = String(expectedRangeHi + randInt(...expectedRandBounds));
      const sensor = { id, sensorTypeId, period, min, max };
      sensors.push(sensor);
    }
  }
  sensors.sort((s1, s2) => s2.id.localeCompare(s1.id));
  return sensors;
}

/** step reading for successive sensors from limitsRangeLo -
 *  rangeAroundNominalValue to to limitsRangeHi +
 *  rangeAroundNominalValue (guaranteeing some readings will be
 *  out-of-range and in-error.
 */
function makeSensorReadings(spec: Spec, sensors: FlatData[]) : FlatData[] {
  const {nReadingsPerSensor, limitsRangeLo, limitsRangeHi, startTimeRands,
	 rangeAroundNominalValue, valueStep, valueRandBounds } = spec;
  const readings: FlatData[] = [];
  let nominalValue = limitsRangeLo;
  for (const sensor of sensors) {
    const valueLo = nominalValue - rangeAroundNominalValue;
    const valueHi = nominalValue + rangeAroundNominalValue;
    let value = valueLo;
    const startLag = randInt(...startTimeRands);
    let t = TIME_START_SECS + startLag;
    const sensorId = sensor.id;
    const period = Number(sensor.period);
    for (let i = 0; i < nReadingsPerSensor; i++) {
      const timestamp = String(t);
      t += period;
      const reading = { sensorId, timestamp, value: String(value) };
      readings.push(reading);
      value += valueStep + randInt(...valueRandBounds);
      if (value > valueHi) value = valueLo;
    }
    nominalValue += 2*rangeAroundNominalValue;
    if (nominalValue > limitsRangeHi) nominalValue = limitsRangeLo;
  }
  readings.sort((r1, r2) => Number(r2.timestamp) - Number(r1.timestamp));
  return readings;
}

/** return rand int in [lo, hi) */
function randInt(lo: number, hi: number) {
  return Math.floor(Math.random()*(hi - lo) + lo);
}



