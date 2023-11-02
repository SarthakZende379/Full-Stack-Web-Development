import { SensorsInfo, makeSensorsInfo, addSensorsInfo }
  from './sensors-info.js';
import { SensorsDao, makeSensorsDao } from './sensors-dao.js';
import { serve, App } from './sensors-ws.js';

import { Errors } from 'cs544-js-utils';
import { cwdPath, readJson } from 'cs544-node-utils';

import assert from 'assert';
import fs from 'fs';
import util from 'util';
import https from 'https';
import Path from 'path';

const readFile = util.promisify(fs.readFile);

export default function () { return main(process.argv.slice(2)); }

async function main(args: string[]) {
  if (args.length < 1) usage();
  const config = (await import(cwdPath(args[0]))).default;
  const port: number = config.ws.port;
  if (port < 1024) {
    usageError(`bad port ${port}: must be >= 1024`);
  }
  let dao : SensorsDao|null = null;
  try {
    const daoResult = await makeSensorsDao(config.service.dbUrl);
    if (!daoResult.isOk) panic(daoResult);
    dao = daoResult.val;
    const servicesResult = await makeSensorsInfo(dao);
    if (!servicesResult.isOk) panic(servicesResult);
    const services = servicesResult.val;
    if (args.length > 1) {
      const loadResult = await loadData(services, args[1]);
      if (!loadResult.isOk) panic(loadResult);
    }
    const {app, close: closeApp} = serve(services, config.ws);
    const serverOpts = {
      key: fs.readFileSync(config.https.keyPath),
      cert: fs.readFileSync(config.https.certPath),
    };
    const server = https.createServer(serverOpts, app)
      .listen(config.ws.port, function() {
	console.log(`listening on port ${config.ws.port}`);
      });
    //terminate using SIGINT ^C
    //console.log('enter EOF ^D to terminate server');
    //await readFile(0, 'utf8');
    //closeApp(); server.close(); 
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
  finally {
    //if (dao) await dao.close();
  }
}


async function loadData(services: SensorsInfo, jsonPath: string) {
  const clearResult = await services.clear();
  if (!clearResult.isOk) return clearResult;
  const readResult: Errors.Result<any> = await readJson(jsonPath);
  if (!readResult.isOk) return readResult;
  const data = readResult.val;
  const { sensorTypes, sensors, sensorReadings } = data;
  const loadResult =
    await addSensorsInfo(sensorTypes, sensors, sensorReadings, services);
  return loadResult;
}

/** Output usage message to stderr and exit */
function usage() : never  {
  const prog = Path.basename(process.argv[1]);
  console.error(`usage: ${prog} CONFIG_MJS [SENSORS_JSON_PATH]`);
  process.exit(1);
}

function usageError(err?: string) {
  if (err) console.error(err);
  usage();
}

function panic(result: Errors.ErrResult) : never {
  assert(!result.isOk);
  result.errors.forEach(e => console.error(e.message));
  process.exit(1);
}
