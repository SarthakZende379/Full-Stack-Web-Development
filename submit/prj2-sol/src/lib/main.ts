import { makeSensorsDao } from './sensors-dao.js';
import {SensorsInfo, makeSensorsInfo, addSensorsInfo} from './sensors-info.js';

import { readJson } from 'cs544-node-utils';
import { Errors } from 'cs544-js-utils';

import assert from 'assert';
import Path from 'path';

/*************************** Top-Level Code ****************************/

export default async function main(args: string[]) {
  if (args.length < 2) usage();
  await go(args[0], args[1], args.slice(2));
}

async function go(dbUrl: string, cmdStr: string, args: string[]) {
  let dao;
  try {
    const daoResult = await makeSensorsDao(dbUrl);
    if (!daoResult.isOk) panic(daoResult);
    dao = daoResult.val;
    const sensorsInfoResult = await makeSensorsInfo(dao);
    if (!sensorsInfoResult.isOk) panic(sensorsInfoResult);
    const sensorsInfo = sensorsInfoResult.val;
    if (!Object.keys(COMMANDS).includes(cmdStr)) {
      console.error(`invalid command "${cmdStr}"`);
      usage();
    }
    const cmd = cmdStr as keyof typeof COMMANDS;
    const cmdInfo = COMMANDS[cmd];
    const result = await cmdInfo.handler(sensorsInfo, args);
    if (!result.isOk) {
      errors(result);
    }
    else if (result.val === undefined) {
      console.log('ok');
    }
    else {
      console.log(JSON.stringify(result.val, null, 2));
    }
  }
  catch (err) {
    panic(Errors.errResult(err.message, 'PANIC'));
  }
  finally {
    if (dao) {
      const closeResult = await dao.close();
      if (!closeResult.isOk) panic(closeResult);
    }
  }
}


/************************* Commands Dispatch ***************************/

type SensorsInfoMethodsRet =
  ReturnType<typeof SensorsInfo.prototype.addSensorType> |
  ReturnType<typeof SensorsInfo.prototype.addSensor> |
  ReturnType<typeof SensorsInfo.prototype.addSensorReading> |
  ReturnType<typeof SensorsInfo.prototype.findSensorTypes> |
  ReturnType<typeof SensorsInfo.prototype.findSensors> |
  ReturnType<typeof SensorsInfo.prototype.findSensorReadings> |
  ReturnType<typeof SensorsInfo.prototype.clear>;
type SensorsInfoMethod = (req: Record<string, string>) => SensorsInfoMethodsRet;

const CMD_ARGS_VALUES = [ 'sensor-type', 'sensor', 'sensor-reading' ];
const CMD_ARGS_STRING = CMD_ARGS_VALUES.join('|');

type CmdType = typeof CMD_ARGS_VALUES[number];

function getCmdArg(arg = 'undefined') : CmdType {
  const cmd = CMD_ARGS_VALUES.includes(arg) && arg;
  if (!cmd) {
    throw(`bad first arg "${arg}": must be one of ${CMD_ARGS_VALUES}`);
  }
  return cmd;
}

type CmdDispatch = Record<CmdType, (s: SensorsInfo) => SensorsInfoMethod>;

const ADD_FNS : CmdDispatch = {
  ['sensor-type']: (s: SensorsInfo) => s.addSensorType,
  ['sensor']: (s: SensorsInfo) => s.addSensor,
  ['sensor-reading']: (s: SensorsInfo) => s.addSensorReading,
};

/** handler for add command */
async function addHandler(sensorsInfo: SensorsInfo, args: string[]) {
  const cmdArg = getCmdArg(args[0]);
  const fn: (req: Record<string, string>) => SensorsInfoMethodsRet =
    ADD_FNS[cmdArg](sensorsInfo);
  return await fn.call(sensorsInfo, getNameValues(args.slice(1)));
}


/** handler for clear command */
async function clearHandler(sensorsInfo: SensorsInfo, args: string[]=[]) {
  if (args.length > 0) {
    return Errors.errResult('sorry; clear does not accept any arguments');
  }
  else {
    return await sensorsInfo.clear();
  }
}


const FIND_FNS : CmdDispatch = {
  ['sensor-type']: (s: SensorsInfo) => s.findSensorTypes,
  ['sensor']: (s: SensorsInfo) => s.findSensors,
  ['sensor-reading']: (s: SensorsInfo) => s.findSensorReadings,
};

/** handler for find command */
async function findHandler<T>(sensorsInfo: SensorsInfo, args: string[]) {
  const cmdArg = getCmdArg(args[0]);
  const fn: (req: Record<string, string>) => SensorsInfoMethodsRet =
    FIND_FNS[cmdArg](sensorsInfo);
  return await fn.call(sensorsInfo, getNameValues(args.slice(1)));
}

/** handler for load command */
async function loadHandler<T>(sensorsInfo: SensorsInfo, args: string[]) {
  const jsonPath = args[0];
  const dataResult = await readJson(jsonPath);
  if (!dataResult.isOk) panic(dataResult);
  const clearResult = await sensorsInfo.clear();
  if (!clearResult.isOk) panic(clearResult);
  const { sensorTypes, sensors, sensorReadings } = dataResult.val;
  return (
    await addSensorsInfo(sensorTypes, sensors, sensorReadings, sensorsInfo)
  );
}

const CMD_WIDTH = 6;
function usage() : never  {
  console.error(`usage: ${Path.basename(process.argv[1])} DB_URL CMD ARGS...`);
  console.error(`  where CMD ARGS can be one of`);
  Object.entries(COMMANDS).
    forEach(([k, v]) => {
      console.error(`\t${k.padEnd(CMD_WIDTH)}${v.msg}`);
    });
  process.exit(1);
}

/** command dispatch table and command help messages */
const COMMANDS = { 
  add: {
    msg: `${CMD_ARGS_STRING} NAME=VALUE...`,
    handler: addHandler,
  },
  clear: {
    msg: '',
    handler: clearHandler,
  },
  find: {
    msg: `${CMD_ARGS_STRING} NAME=VALUE...`,
    handler: findHandler,
  },
  load: {
    msg: `JSON_SENSORS_DATA_PATH`,
    handler: loadHandler,
  },
};

/******************************* Utilities *****************************/

function getNameValues(defArgs: string[]) : Record<string, string> {
  const nameValues: Record<string, string> = {};
  for (const def of defArgs) {
    const splits = def.trim().split('=');
    if (splits.length != 2) {
      throw `bad NAME=VALUE argument '${def}'`;
    }
    const [name, value] = splits;
    nameValues[name] = value;
  }
  return nameValues;
}

function errors<T>(result: Errors.Result<T>) {
  if (result.isOk) return;
  for (const err of result.errors) {
    console.error(err.message);
  }
}

function panic<T>(result: Errors.Result<T>) : never {
  errors(result);
  process.exit(1);
}



