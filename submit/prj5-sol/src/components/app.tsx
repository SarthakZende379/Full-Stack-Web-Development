import React, { ChangeEvent, FormEvent, useState, MouseEvent } from "react";

import { makeSensorsWs, PagedValues, SensorsWs } from "../lib/sensors-ws.js";

import Tab from "./tab.js";

import { Err, ErrResult, Result } from "cs544-js-utils/dist/lib/errors.js";
import { Errors } from "cs544-js-utils";
import FindSensor from "./findSensor.js";
import FindSensorType from "./findSensorType.js";
import Addsensor from "./addsensor.js";
import AddSensorType from "./addSensorType.js";

type AppProps = {
  wsUrl: string;
};
interface SearchFormFindSensorData {
  id?: string;
  sensorTypeId?: string;
}
interface SensorFormData {
  sensorTypeId: string;
  id: string;
  period: number;
  min: number;
  max: number;
}

interface SearchFormFindData {
  id: string;
  manufacturer: string;
  modelNumber: string;
  quantity: string;
  unit: string;
}
interface FormData {
  id: string;
  manufacturer: string;
  modelNumber: string;
  quantity: string;
  unit: string;
  min: number;
  max: number;
}
export default function App(props: AppProps) {
  const ws = makeSensorsWs(props.wsUrl);
  const [selectedId, selectTab] = React.useState("addSensorType");
  
  return (
    <div className="tabs">
      {/* add sensor type */}
      <Tab
        id="addSensorType"
        label="Add Sensor Type"
        isSelected={selectedId === "addSensorType"}
        select={selectTab}
      >
        {/* TODO Add Sensor Type Component */}

        <AddSensorType wsUrl={"https://localhost:2345"} />
      </Tab>
      {/* add sensor */}
      <Tab
        id="addSensor"
        label="Add Sensor"
        isSelected={selectedId === "addSensor"}
        select={selectTab}
      >
        {/* TODO Add Sensor Component */}
        <Addsensor wsUrl={"https://localhost:2345"} />
      </Tab>
      {/* find sensor types */}
      <Tab
        id="findSensorTypes"
        label="Find Sensor Types"
        isSelected={selectedId === "findSensorTypes"}
        select={selectTab}
      >
        {/* TODO Find Sensor Type Component */}
        <FindSensorType wsUrl={"https://localhost:2345"} />
      </Tab>

      <Tab
        id="findSensors"
        label="Find Sensors"
        isSelected={selectedId === "findSensors"}
        select={selectTab}
      >
        <FindSensor wsUrl={"https://localhost:2345"} />
      </Tab>
    </div>
  );
}
