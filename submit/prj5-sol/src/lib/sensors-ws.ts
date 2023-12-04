import { Errors } from 'cs544-js-utils';

import { SensorType, Sensor } from './validators.js';
import { PagedEnvelope, } from './response-envelopes.js';

export function makeSensorsWs(url: string) {
  return new SensorsWs(url);
}

export class SensorsWs {
  //base url for these web services
  private url;

  constructor(url: string) { this.url = url; }

  /** Use web-services to create a sensor-type based on the parameters
   *  specified in req.  If the response envelope is in error, then
   *  return the errors within the Result object.  Otherwise, return a
   *  success Result containing the information in the success
   *  envelope converted to a display sensor-type.
   */
  async addSensorType(req: Record<string, string>)
    : Promise<Errors.Result<Record<string, string>>>
  {
    const url = new URL(`${this.url}/sensors-info/sensor-types`);
    return addData(url, req, makeSensorTypeDisplay);
  }

  /** Use web-services to create a sensor based on the parameters
   *  specified in req.  If the response envelope is in error, then
   *  return the errors within the Result object.  Otherwise, return a
   *  success Result containing the information in the success
   *  envelope converted to a display sensor.
   */
  async addSensor(req: Record<string, string>)
    : Promise<Errors.Result<Record<string, string>>>
  {
    const url = new URL(`${this.url}/sensors-info/sensors`);
    return addData(url, req, makeSensorDisplay);
  }


  /** Return the next page of display sensor-types using the absolute URL 
   *  constructed by concatenating relLink to the base URL for these
   *  web services. The success return will possibly contain next
   *  and prev relative URLs returned in the response, as well as
   *  the returned sensor-types converted to display sensor-types.
   */
  async findSensorTypesByRelLink(relLink: string)
    : Promise<Errors.Result<PagedValues>>
  {
    return findData<SensorType>(new URL(this.url + relLink),
				makeSensorTypeDisplay);
  }
    
  /** Return the first page of display sensor-types based on the
   *  search request req.  The success return will possibly contain next
   *  and prev relative URLs returned in the response, as well as
   *  the returned sensor-types converted to display sensor-types.
   */
  async findSensorTypesByReq(req: Record<string, string>)
    : Promise<Errors.Result<PagedValues>>
  {
    const baseUrl = `${this.url}/sensors-info/sensor-types`;
    return findData<SensorType>(makeQueryUrl(baseUrl, req),
				makeSensorTypeDisplay);
  }

  /** Return the next page of display sensors using the absolute URL 
   *  constructed by concatenating relLink to the base URL for these
   *  web services. The success return will possibly contain next
   *  and prev relative URLs returned in the response, as well as
   *  the returned sensor-types converted to display sensors.
   */
  async findSensorsByRelLink(relLink: string)
    : Promise<Errors.Result<PagedValues>>
  {
    return findData<Sensor>(new URL(this.url + relLink), makeSensorDisplay);
  }
    

  /** Return the first page of display sensors based on the search
   *  request req.  The success return will possibly contain next and
   *  prev relative URLs returned in the response, as well as the
   *  returned sensor-types converted to display sensors.
   */
  async findSensorsByReq(req: Record<string, string>)
    : Promise<Errors.Result<PagedValues>>
  {
    const baseUrl = `${this.url}/sensors-info/sensors`;
    return findData<Sensor>(makeQueryUrl(baseUrl, req), makeSensorDisplay);
  }

}

/** Make a suitable request to the web services at URL url to
 *  create a sensor-type or sensor with parameters specified by data.
 *  If the web request results in an error or returns an error
 *  envelope, then return an error Result containing suitable errors.  
 *  Otherwise return an ok Result containing the results of the displayFn 
 *  applied to the result from the success envelope.
 */
async function addData<T>(url: URL, data: Record<string, string>,
			  displayFn: (t: T) => Record<string, string>)
  : Promise<Errors.Result<Record<string, string>>>
{
  return Errors.errResult('TODO');
}

/** a type representing scrollable results returned by find* services */
export type PagedValues = {
  values: Record<string, string>[],
  next?: string,
  prev?: string,
};
  
/** Make a suitable request to the web services at URL url to
 *  find sensor-types or sensors matching the query parameters in url.
 *  If the web request results in an error or returns an error
 *  envelope, then return an error Result containing suitable errors.  
 *  Otherwise return an ok Result containing the results of the displayFn 
 *  applied to the result array from the success envelope along with
 *  any next and prev href's.
 */
async function findData<T>(url: URL,
			   displayFn: (t: T) => Record<string, string>)
  : Promise<Errors.Result<PagedValues>>
{
  return Errors.errResult('TODO');
}

/** Given a baseUrl and req, return a URL object which contains
 *  req as query-parameters appended to baseUrl.
 */
function makeQueryUrl(baseUrl: string, req: Record<string, string>) : URL {
  const url = new URL(baseUrl);
  Object.entries(req).forEach(([k, v]) => url.searchParams.append(k, v));
  return url;
}

/** Given a sensorType having data from SensorType, return an object
 *  mapping strings describing the fields to their string values.
 */
function makeSensorTypeDisplay(sensorType: SensorType)
  : Record<string, string> 
{
  return {
    'Sensor Type ID': sensorType.id,
    'Manufacturer': sensorType.manufacturer,
    'Model Number': sensorType.modelNumber,
    'Quantity': sensorType.quantity,
    'Unit': sensorType.unit,
    'Min Limit': sensorType.limits.min.toString(),
    'Max Limit': sensorType.limits.max.toString(),
  }
}

/** Given a sensor having data from Sensor, return an object mapping
 *  strings describing the fields to their string values.
 */
function makeSensorDisplay(sensor: Sensor) : Record<string, string> {
  return {
    'Sensor ID': sensor.id,
    'Sensor Type ID': sensor.sensorTypeId,
    'Period': sensor.period.toString(),
    'Min Expected': sensor.expected.min.toString(),
    'Max Expected': sensor.expected.max.toString(),
  }
}

