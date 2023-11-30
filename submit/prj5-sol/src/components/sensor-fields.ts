export type FieldDef = {
  name: string,
  label: string,
  type?: string,     //type for <input/>; should default to text
  isFind?: boolean,  //is used for find forms
};

const SENSOR_DEFS : Record<string, FieldDef[]> = {
  SensorType: [
    { name: 'id', label: 'Sensor Type ID', isFind: true },
    { name: 'manufacturer', label: 'Manufacturer', isFind: true },
    { name: 'modelNumber', label: 'Model Number', isFind: true },
    { name: 'quantity', label: 'Quantity', isFind: true },
    { name: 'unit', label: 'Unit', isFind: true },
    { name: 'min', label: 'Min Limit', type: 'number', },
    { name: 'max', label: 'Max Limit', type: 'number', },
  ],
  Sensor: [
    { name: 'id', label: 'Sensor ID', isFind: true },
    { name: 'sensorTypeId', label: 'Sensor Type ID', isFind: true },
    { name: 'period', label: 'Period', type: 'number', },
    { name: 'min', label: 'Min Expected',  type: 'number', },
    { name: 'max', label: 'Max Expected',  type: 'number', },
  ],
};

export default SENSOR_DEFS;
