import cors from 'cors';
import Express from 'express';
import bodyparser from 'body-parser';
import assert from 'assert';
import STATUS from 'http-status';

import { SensorsInfo } from './sensors-info.js';
import { SensorType,SensorTypeSearch, Sensor, SensorReading, SensorSearch, SensorReadingSearch,  } from './validators.js';
import { Errors } from 'cs544-js-utils';
import { DEFAULT_INDEX, DEFAULT_COUNT } from './params.js';
import { Request, Response } from 'express';

import { Link, SelfLinks, NavLinks,
	 SuccessEnvelope, PagedEnvelope, ErrorEnvelope }
  from './response-envelopes.js';
import { types } from 'util';


//Based on 
//<https://plainenglish.io/blog/typed-express-request-and-response-with-typescript>
//Instead of depending on express.js types, specify query-string types
type RequestWithQuery = Express.Request
  & { query: { [_: string]: string|string[]|number } };

export type App = Express.Application;

type ServeRet = {
  app: App,
  close: () => void,
};

type SERVER_OPTIONS = {
  base?: string,
};
    
export function serve(model: SensorsInfo, options: SERVER_OPTIONS={})
  : ServeRet
{
  const app = Express();
  app.locals.sensorsInfo = model;
  const { base = '/sensors-info',  } = options;
  app.locals.base = base;
  setupRoutes(app);
  const close = () => app.locals.sessions.close();
  return { app, close };
}


function setupRoutes(app: Express.Application) {
  const base = app.locals.base;

  //allow cross-origin resource sharing
  app.use(cors(CORS_OPTIONS));

  //assume that all request bodies are parsed as JSON
  app.use(Express.json());

  //if uncommented, all requests are traced on the console
  //app.use(doTrace(app));

  //TODO: add routes  
// Create a new sensor
app.put(`${base}/sensors`, doCreateSensor(app)); // Handles the creation of a new sensor
app.get(`${base}/sensors`, doFindSensors(app)); // Handles the retrieval of sensors
app.put(`${base}/sensor-readings`, doCreateSensorReading(app)); // Handles the creation of sensor readings
app.get(`${base}/sensor-readings`, doFindSensorReadings(app)); // Handles the retrieval of sensor readings
app.get(`${base}/sensors/:id`, doGetSensor(app)); // Handles the retrieval of a specific sensor by ID
app.get(`${base}/sensor-types/:id`, doGetSensorType(app)); // Handles the retrieval of a specific sensor type by ID
app.put(`${base}/sensor-types`, doCreateSensorType(app)); // Handles the creation of a new sensor type
app.get(`${base}/sensor-types`, doFindSensorTypes(app)); // Handles the retrieval of sensor types
  //must be last
  app.use(do404(app));  //custom handler for page not found
  app.use(doErrors(app)); //custom handler for internal errors
}
// TODO: add route handlers 

// Route handler for creating a new sensor
function doCreateSensor(app: Express.Application) {
  return async (req: Express.Request, res: Express.Response) => {
   try {
    const result = await app.locals.sensorsInfo.addSensor({...req.body});
    if (result.isOk) {
     const createdSensor = result.val;
     const { id: sensorId } = createdSensor;
     res.location(selfHref(req, sensorId));
     const response = selfResult<Sensor>(req, createdSensor, STATUS.CREATED);
     res.status(STATUS.CREATED).json(response);
    } else {
     const errResult = result;
     const mapped = mapResultErrors(errResult);
     res.status(mapped.status).json(mapped);
    }
   } catch (err) {
    const errorMessage = 'An error occurred while creating the sensor.';
    console.error(errorMessage, err);
    res.status(500).json({ error: errorMessage });
   }
  };
 }

 // Route handler for finding sensor types
 function doFindSensorTypes(app: Express.Application) {
  return async (req: RequestWithQuery, res: Express.Response) => {
    try {
      const { query } = req; // Destructure the query object from the request
      const result = await app.locals.sensorsInfo.findSensorTypes({ ...query });

      if (!result.isOk) {
        // Handle the error appropriately, for example:
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // You have successfully retrieved sensor types
      const resp = result.val.map((res:SensorType)=>selfResult<SensorType>(req,res)).sort((res:SensorType)=>res.id);
      const response = selfResult<SensorType[]>(req,resp);
      res.json(response);
    } catch (err) {
      const mapped = mapResultErrors(err);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for retrieving a specific sensor type by ID
function doGetSensorType(app: Express.Application) {
  return async function (req: Express.Request, res: Express.Response) {
    try {
      
      const result = await app.locals.sensorsInfo.findSensorTypes({ ...req.params });

      if (result.isOk) {
        const sensorTypes = result.val;
        if (sensorTypes.length > 0) {
          const response = selfResult<SensorType>(req, sensorTypes[0]);
          res.json(response);
        } else {
          res.status(404).json({ error: 'Sensor type not found' });
        }
      } else {
        if (result.errorCode === 'DB') {
          const errorMessage = 'A database error occurred while retrieving sensor types.';
          console.error(errorMessage, result.error);
          res.status(500).json({ error: errorMessage });
        } else {
          throw result;
        }
      }
    } catch (err) {
      const mapped = mapResultErrors(err);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for retrieving a sensor by ID
function doGetSensor(app: Express.Application) {
  return async (req: Express.Request, res: Express.Response) => {
    try {
      const result = await app.locals.sensorsInfo.findSensors({ ...req.params });
      if (result.isOk) {
        const sensors = result.val;
        if (sensors.length > 0) {
          const response = selfResult<SensorType>(req, sensors[0]); // Assuming only one sensor is expected
          res.status(STATUS.OK).json(response);
        } else {
          const notFoundResponse = {
            isOk: false, // Indicate that the operation was not successful
            errors: [{
              options: { code: 'NOT_FOUND' },
              message: 'No sensor with the specified ID was found.',
            }],
          };
          res.status(STATUS.NOT_FOUND).json(notFoundResponse);
        }
      } else {
        if (result.errorCode === 'DB') {
          const errorMessage = 'A database error occurred while retrieving the sensor.';
          console.error(errorMessage, result.error);
          res.status(500).json({ error: errorMessage });
        } else {
          throw result; // Throw the result for error handling
        }
      }
    } catch (err) {
      const mapped = mapResultErrors(err);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for creating a new sensor type
function doCreateSensorType(app: Express.Application) {
  return async (req: Express.Request, res: Express.Response) => {
    const result = await app.locals.sensorsInfo.addSensorType(req.body);
    if (result.isOk) {
      const createdSensorType = result.val;
      const { id } = createdSensorType;
      res.location(selfHref(req, id));
      const response = selfResult<SensorType>(req, createdSensorType, STATUS.CREATED);
      res.status(STATUS.CREATED).json(response);
    } else {
      const errResult = result;
      const mapped = mapResultErrors(errResult);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for Find-Sensors
function doFindSensors(app: Express.Application) {
  return async (req: RequestWithQuery, res: Express.Response) => {
    try {
      const { query } = req; 
      const result = await app.locals.sensorsInfo.findSensors({...query});
      if (!result.isOk) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // You have successfully retrieved sensor types
      const resp = result.val.map((res:Sensor)=>selfResult<Sensor>(req,res)).sort((res:Sensor)=>res.id);
      const response = selfResult<Sensor[]>(req,resp);
      res.json(response);
    } catch (err) {
      const mapped = mapResultErrors(err);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for Create-Sensor-Reading
function doCreateSensorReading(app: Express.Application) {
  return async (req: Express.Request, res: Express.Response) => {
    const result = await app.locals.sensorsInfo.addSensorReading({...req.body});
    if (result.isOk) {
      const createdSensorReading = result.val;
      const { sensorId } = createdSensorReading;
      res.location(selfHref(req, sensorId));
      const response = selfResult<SensorReading>(req, createdSensorReading, STATUS.CREATED);
      res.status(STATUS.CREATED).json(response);
    } else {
      const errResult = result;
      const mapped = mapResultErrors(errResult);
      res.status(mapped.status).json(mapped);
    }
  };
}

// Route handler for finding sensor readings
function doFindSensorReadings(app: Express.Application) {
  return async (req: RequestWithQuery, res: Express.Response) => {
    try {
      const result = await app.locals.sensorsInfo.findSensorReadings({ ...req.query });
      if (result.isOk) {
        const foundSensorReadings = result.val || [];
        // Filter out any invalid or undefined sensor readings
        const validSensorReadings = foundSensorReadings.filter(
          (reading: SensorReading) => reading && typeof reading.timestamp === 'number'
        );
        // Sort the valid sensor readings by timestamp
        const sortedSensorReadings = validSensorReadings.sort(
          (a: SensorReading, b: SensorReading) => a.timestamp - b.timestamp
        );
        // You have successfully retrieved sensor readings
        const resp = sortedSensorReadings.map((res: SensorReading) => selfResult<SensorReading>(req, res)).sort((res: SensorReading) => res.timestamp);
        const response = selfResult<SensorReading[]>(req, resp, STATUS.OK);
        res.json(response);
      } else {
        const mapped = mapResultErrors(result);
        res.status(mapped.status).json(mapped);
      }
    } catch (err) {
      const mapped = mapResultErrors(err);
      res.status(mapped.status).json(mapped);
    }
  };
}


/** Default handler for when there is no route for a particular method
 *  and path.
 */
function do404(app: Express.Application) {
  return async function(req: Express.Request, res: Express.Response) {
    const message = `${req.method} not supported for ${req.originalUrl}`;
    const result = {
      status: STATUS.NOT_FOUND,
      errors: [	{ options: { code: 'NOT_FOUND' }, message, }, ],
    };
    res.status(404).json(result);
  };
}

/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */ 
function doErrors(app: Express.Application) {
  return async function(err: Error, req: Express.Request, res: Express.Response,
			next: Express.NextFunction) {
    const message = err.message ?? err.toString();
    const [status, code] = (err instanceof SyntaxError)
      ? ['BAD_REQUEST', 'SYNTAX' ]
      : ['INTERNAL_SERVER_ERROR', 'INTERNAL'];
    const result = {
      status: STATUS[status],
      errors: [ { options: { code }, message } ],
    };
    res.status(Number(STATUS[status])).json(result);
    if (status === 'INTERNAL_SERVER_ERROR') console.error(result.errors);
  };
}



/************************* HATEOAS Utilities ***************************/

/** Return original URL for req */
function requestUrl(req: Express.Request) {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}

/** Return path for req.  If id specified extend with /id, otherwise add in
 *  any query params. 
 */
function selfHref(req: Express.Request, id: string = '') {
  const url = new URL(requestUrl(req));
  return url.pathname + (id ? `/${id}` : url.search);
}

/** Produce paging link for next (dir === 1), prev (dir === -1)
 *  for req having nResults results.  Return undefined if there
 *  is no such link.
 */
function pageLink(req: Express.Request, nResults: number, dir: 1|-1) {
  const url = new URL(requestUrl(req));
  const count = Number(req.query?.count ?? DEFAULT_COUNT);
  const index0 = Number(url.searchParams.get('index') ?? 0);
  if (dir > 0 ? nResults <= count : index0 <= 0) return undefined;
  const index = dir > 0 ? index0 + count : count > index0 ? 0 : index0 - count;
  url.searchParams.set('index', String(index));
  url.searchParams.set('count', String(count));
  return url.pathname + url.search;
}

/** Return a success envelope for a single result. */
function selfResult<T>(req: Express.Request, result: T,
		       status: number = STATUS.OK)
  : SuccessEnvelope<T>
{
  const method = req.method;
  return { isOk: true,
	   status,
	   links: { self: { rel: 'self', href: selfHref(req), method } },
	   result,
	 };
}


/** Return a paged envelope for multiple results for type T. */
function pagedResult<T>(req: Express.Request, idKey: keyof T, results: T[])
  : PagedEnvelope<T>
{
  const nResults = results.length;
  const result = //(T & {links: { self: string } })[]  =
    results.map(r => {
      const selfLinks : SelfLinks =
	{ self: { rel: 'self', href: selfHref(req, String(r[idKey])),
		  method: 'GET' } };
	return { result: r, links: selfLinks };
    });
  const links: NavLinks =
    { self: { rel: 'self', href: selfHref(req), method: 'GET' } };
  const next = pageLink(req, nResults, +1);
  if (next) links.next = { rel: 'next', href: next, method: 'GET', };
  const prev = pageLink(req, nResults, -1);
  if (prev) links.prev = { rel: 'prev', href: prev, method: 'GET', };
  const count = req.query.count ? Number(req.query.count) : DEFAULT_COUNT;
  return { isOk: true, status: STATUS.OK, links,
	   result: result.slice(0, count), };
}
 
/*************************** Mapping Errors ****************************/

//map from domain errors to HTTP status codes.  If not mentioned in
//this map, an unknown error will have HTTP status BAD_REQUEST.
const ERROR_MAP: { [code: string]: number } = {
  EXISTS: STATUS.CONFLICT,
  NOT_FOUND: STATUS.NOT_FOUND,
  BAD_REQ: STATUS.BAD_REQUEST,
  AUTH: STATUS.UNAUTHORIZED,
  DB: STATUS.INTERNAL_SERVER_ERROR,
  INTERNAL: STATUS.INTERNAL_SERVER_ERROR,
}

/** Return first status corresponding to first options.code in
 *  errors, but INTERNAL_SERVER_ERROR dominates other statuses.  Returns
 *  BAD_REQUEST if no code found.
 */
function getHttpStatus(errors: Errors.Err[]) : number {
  let status: number = 0;
  for (const err of errors) {
    if (err instanceof Errors.Err) {
      const code = err?.options?.code;
      const errStatus = (code !== undefined) ? ERROR_MAP[code] : -1;
      if (errStatus > 0 && status === 0) status = errStatus;
      if (errStatus === STATUS.INTERNAL_SERVER_ERROR) status = errStatus;
    }
  }
  return status !== 0 ? status : STATUS.BAD_REQUEST;
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapResultErrors(err: Error|Errors.ErrResult) : ErrorEnvelope {
  const errors = err instanceof Errors.ErrResult
    ? err.errors
    : [ new Errors.Err(err.message ?? err.toString(), {code: 'UNKNOWN'}), ];
  const status = getHttpStatus(errors);
  if (status === STATUS.INTERNAL_SERVER_ERROR)  console.error(errors);
  return { isOk: false, status, errors, };
} 

/**************************** CORS Options *****************************/

/** options which affect whether cross-origin (different scheme, domain or port)
 *  requests are allowed
 */
const CORS_OPTIONS = {
  //if localhost origin, reflect back in Access-Control-Allow-Origin res hdr
  // origin: /localhost:\d{4}/,
  
  // simple reflect req origin hdr back to Access-Control-Allow-Origin res hdr
  origin: true,

  //methods allowed for cross-origin requests
  methods: [ 'GET', 'PUT', ],

  //request headers allowed on cross-origin requests
  //used to allow JSON content
  allowedHeaders: [ 'Content-Type', ],

  //response headers exposed to cross-origin requests
  exposedHeaders: [  'Location', 'Content-Type', ],
};

