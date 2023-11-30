import React from 'react';

import { makeSensorsWs, SensorsWs } from '../lib/sensors-ws.js';

import Tab from './tab.js';

import SENSOR_FIELDS from './sensor-fields.js';


type AppProps = {
  wsUrl: string,
};

export default function App(props: AppProps) {
  const ws = makeSensorsWs(props.wsUrl);
  const [ selectedId, selectTab ] = React.useState('addSensorType');
  return (
    <div className="tabs">
      <Tab id="addSensorType" label="Add Sensor Type" 
           isSelected={selectedId === 'addSensorType'}
           select={selectTab}>
         {/* TODO Add Sensor Type Component */}
      </Tab>
      <Tab id="addSensor" label="Add Sensor" 
           isSelected={selectedId === 'addSensor'}
           select={selectTab}>
         {/* TODO Add Sensor Component */}
      </Tab>
      <Tab id="findSensorTypes" label="Find Sensor Types" 
           isSelected={selectedId === 'findSensorTypes'}
           select={selectTab}>
         {/* TODO Find Sensor Type Component */}
      </Tab>
      <Tab id="findSensors" label="Find Sensors" 
           isSelected={selectedId === 'findSensors'}
           select={selectTab}>
         {/* TODO Find Sensor Component */}
      </Tab>
    </div>
  );
}

