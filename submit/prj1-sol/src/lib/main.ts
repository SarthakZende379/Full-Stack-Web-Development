import assert from 'assert';
import Path from 'path';
import readline from 'readline';

import { readJson } from 'cs544-node-utils';
import { Errors } from 'cs544-js-utils';

import {SensorsInfo, makeSensorsInfo, addSensorsInfo} from './sensors-info.js';

/*************************** Top-Level Code ****************************/

export default async function main(args: string[]) {
  if (args.length < 1) {
    console.error('usage: %s JSON_PATH...', Path.basename(process.argv[1]));
    process.exit(1);
  }
  await go(process.argv.slice(2));
}

async function go(paths: string[]) {
  assert(paths.length > 0);
  const sensorsInfoResult = makeSensorsInfo();
  if (!sensorsInfoResult.isOk) panic(sensorsInfoResult);
  const sensorsInfo = sensorsInfoResult.val;
  for (const path of paths) {
    const readResult = await readJson(path);
    if (!readResult.isOk) panic(readResult);
    const { sensorTypes, sensors, sensorReadings } = readResult.val;
    const addResult =
      addSensorsInfo(sensorTypes, sensors, sensorReadings, sensorsInfo);
    if (!addResult.isOk) panic(addResult);
  }
  help(sensorsInfo);
  await interact(sensorsInfo);
}


/*************************** User Interaction **************************/

const PROMPT = '>> ';

function interact(sensorsInfo: SensorsInfo) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
    prompt: PROMPT,
  });
  rl.prompt();
  rl.on('line', async (line: string) => {
    await doLine(sensorsInfo, line);
    rl.prompt();
  });
}

const ARGS_RE = /\"([^\"+]+)\"|\'([^\']+)\'|(\S+)/g;
function doLine(sensorsInfo: SensorsInfo, line: string) {
  line = line.trim();
  const args: string[] =
    [ ...line.matchAll(ARGS_RE) ].map(m => m[1]??m[2]??m[3]);
  if (line.length > 0 && args.length > 0) {
    try {
      const cmdStr = args[0];
      if (!Object.keys(COMMANDS).includes(cmdStr)) {
	console.error(`invalid command "${cmdStr}"`);
	help(sensorsInfo);
      }
      else {
	const cmd = cmdStr as keyof typeof COMMANDS;
	const cmdInfo = COMMANDS[cmd];
	const result = cmdInfo.handler(sensorsInfo, args.slice(1));
	if (result.isOk) {
	  console.log(JSON.stringify(result.val, null, 2));
	}
	else {
	  errors(result);
	}
      }
    }
    catch (err) {
      errors(Errors.errResult(err.message));
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
function addHandler(sensorsInfo: SensorsInfo, args: string[]) {
  const cmdArg = getCmdArg(args[0]);
  const fn: (req: Record<string, string>) => SensorsInfoMethodsRet =
    ADD_FNS[cmdArg](sensorsInfo);
  return fn.call(sensorsInfo, getNameValues(args.slice(1)));
}


/** handler for clear command */
function clearHandler(sensorsInfo: SensorsInfo, args: string[]=[]) {
  if (args.length > 0) {
    return Errors.errResult('sorry; clear does not accept any arguments');
  }
  else {
    return sensorsInfo.clear();
  }
}


const FIND_FNS : CmdDispatch = {
  ['sensor-type']: (s: SensorsInfo) => s.findSensorTypes,
  ['sensor']: (s: SensorsInfo) => s.findSensors,
  ['sensor-reading']: (s: SensorsInfo) => s.findSensorReadings,
};

/** handler for find command */
function findHandler<T>(sensorsInfo: SensorsInfo, args: string[]) {
  const cmdArg = getCmdArg(args[0]);
  const fn: (req: Record<string, string>) => SensorsInfoMethodsRet =
    FIND_FNS[cmdArg](sensorsInfo);
  return fn.call(sensorsInfo, getNameValues(args.slice(1)));
}

/** handler for help command */
function help(sensorsInfo: SensorsInfo, args: string[]=[])
  : Errors.Result<void>
{
  if (args.length > 0) {
    console.error('sorry; help does not accept any arguments');
  }
  Object.entries(COMMANDS).
    forEach(([k, v]) => {
      console.error(`${k.padEnd(CMD_WIDTH)}${v.msg}`);
    });
  return Errors.VOID_RESULT;
}

const CMD_WIDTH = 6;

/** command dispatch table and command help messages */
const COMMANDS = { 
  add: {
    msg: `${CMD_ARGS_STRING} NAME=VALUE...`,
    handler: addHandler,
  },
  clear: {
    msg: 'clear all sensor data',
    handler: clearHandler,
  },
  find: {
    msg: `${CMD_ARGS_STRING} NAME=VALUE...`,
    handler: findHandler,
  },
  help: {
    msg: 'output this message',
    handler: help,
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



