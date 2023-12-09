import { Err } from "cs544-js-utils/dist/lib/errors";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { makeSensorsWs } from "src/lib/sensors-ws";
import { SensorType } from "src/lib/validators";
type AppProps = {
  wsUrl: string;
};
interface SensorFormData {
  id: string;
  sensorTypeId: string;
  period: number;
  min: number;
  max: number;
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
function Addsensor(props: AppProps) {
  const ws = makeSensorsWs(props.wsUrl);
  const initialSensorFormData: SensorFormData = {
    id: "",
    sensorTypeId: "",
    period: 0,
    min: 0,
    max: 0,
  };
  const [fieldError, setFieldError] = useState<Err[] | null>(null);
  const [fieldError1, setFieldError1] = useState<Err[] | null>(null);
  const [fieldError2, setFieldError2] = useState<Err[] | null>(null);

  const [addSensor, setAddSensor] = useState<SensorFormData>({
    sensorTypeId: "",
    id: "",
    period: 0,
    min: 0,
    max: 0,
  });
  const [apiResponse, setApiResponse] = useState<Record<
    string,
    string
  > | null>();
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddSensorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddSensor((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSensorSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const plainFormData: Record<string, string> = {
      ...addSensor,
      period: String(addSensor.period), // Convert to string if period is expected to be a string
      max: String(addSensor.max), // Convert to number if max is expected to be a number
      min: String(addSensor.min),
    };

    for (const key in plainFormData) {
      if (addSensor[key as keyof SensorFormData] === "") {
        setFormError(`is required`);
        console.log(key, plainFormData[key]);
        return;
      }
    }
    try {
      const response = await ws.addSensor(plainFormData);
      console.log(response);

      if (response.isOk) {
        setApiResponse(response.val);
      } else {
        setFieldError(response.errors);
        setFieldError2(response.errors);
        console.log(response.errors);
        // Keep the entered values in case of an error
        setAddSensor(
          (prevAddSensor): SensorFormData => ({
            ...prevAddSensor,
            period: Number(prevAddSensor.period),
            id: String(prevAddSensor.id),
            max: Number(prevAddSensor.max),
            min: Number(prevAddSensor.min),
            sensorTypeId: String(prevAddSensor.sensorTypeId),
          })
        );
        console.log("test", addSensor);
      }

      // setAddSensor({
      //   id: "",
      //   period: 0,
      //   sensorTypeId: "",
      //   max: 0,
      //   min: 0,
      // });
    } catch (error) {
      return error;
    }
  };

  return (
    <div>
      <div id="addSensor" className="tab-content">
        <ul id="addSensor-errors" className="addSensor-errors error">
          {fieldError && (
            <div>
              {fieldError!.map((test, index) => (
                <div key={index}>
                  {test.options?.code === "UNKNOWN" && <p>{test.message}</p>}
                </div>
              ))}
            </div>
          )}
        </ul>
        <form
          className="grid-form"
          id="addSensor-form"
          name="addSenso-form"
          onSubmit={handleAddSensorSubmit}
        >
<<<<<<< HEAD
=======
          {" "}
          <label htmlFor="findSensorTypes-id">
            Sensor ID{" "}
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.id}
              id="addSensor-id"
              name="id"
            />
            <br />

            <span id="addSensor-id error" className="addSensor-errors error">
              {" "}
              {formError && <div className="error">"id"{formError}</div>}
              {fieldError && (
                <div>
                  {fieldError!.map((test, index) => (
                    <div key={index}>
                      {test.options?.widget === "id" && <p>{test.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </span>
          </span>
>>>>>>> main
          <label htmlFor="findSensorTypes-id">
            Sensor Type ID{" "}
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.sensorTypeId}
              id="addSensor-sensorTypeId"
              name="sensorTypeId"
            />
            <br />
            <span
              id="findSensorTypes-id-error"
              className="findSensorTypes-errors error"
            >
              {" "}
              {formError && (
                <div className="error">"SensorTypeId"{formError}</div>
              )}
              {fieldError && (
                <div>
                  {fieldError!.map((test, index) => (
                    <div key={index}>
                      {test.options?.widget === "sensorTypeId" && (
                        <p>{test.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </span>
          </span>
<<<<<<< HEAD
          <label htmlFor="findSensorTypes-id">
            Sensor ID{" "}
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.id}
              id="addSensor-id"
              name="id"
            />
            <br />

            <span id="addSensor-id error" className="addSensor-errors error">
              {" "}
              {formError && <div className="error">"id"{formError}</div>}
              {fieldError && (
                <div>
                  {fieldError!.map((test, index) => (
                    <div key={index}>
                      {test.options?.widget === "id" && <p>{test.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </span>
          </span>
=======
>>>>>>> main
          <label htmlFor="findSensor-period">
            Period{" "}
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.period}
              id="addSensor-period"
              name="period"
            />
            <br />
            <span
              id="addSensor-period-error"
              className="addSensor-errors error"
            >
              {" "}
              {formError && <div className="error">"period"{formError}</div>}
            </span>
          </span>
          <label htmlFor="addSensor-min">
            Min Limit
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.min}
              id="addSensor-min"
              name="min"
              type="number"
            />
            <br />
            <span id="addSensor-min-error" className="addSensor-errors error">
              {" "}
              {formError && <div className="error">"min"{formError}</div>}
              {fieldError && (
                <div>
                  {fieldError!.map((test, index) => (
                    <div key={index}>
                      {test.options?.widget === "min" && <p>{test.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </span>
          </span>
          <label htmlFor="addSensor-max">
            Max Limit
            <span className="required" title="Required">
              *
            </span>
          </label>
          <span>
            <input
              onChange={handleAddSensorChange}
              value={addSensor.max}
              id="addSensor-max"
              name="max"
              type="number"
            />
            <br />
            <span id="addSensor-max-error" className="addSensor-errors error">
              {" "}
              {formError && <div className="error">"max"{formError}</div>}
              {fieldError && (
                <div>
                  {fieldError!.map((test, index) => (
                    <div key={index}>
                      {test.options?.widget === "max" && <p>{test.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </span>
          </span>
          <span></span>
          <button>Add Sensor</button>
        </form>

        <div
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
          id="addSensorType-results"
          className="results"
        >
          {apiResponse && (
            <div style={{ width: "50%", marginBottom: "10px" }}>
              <div style={{ display: "flex", marginBottom: "5px" }}>
<<<<<<< HEAD
                <span style={{ fontWeight: "800", minWidth:"250px" }}>
                  ID
                </span>
                <span>{apiResponse["Sensor ID"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth:"250px" }}>
=======
                <span style={{ fontWeight: "800", minWidth: "250px" }}>ID</span>
                <span>{apiResponse["Sensor ID"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
>>>>>>> main
                  Sensor Type ID
                </span>
                <span>{apiResponse["Sensor Type ID"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
<<<<<<< HEAD
                <span style={{ fontWeight: "800", minWidth:"250px" }}>
=======
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
>>>>>>> main
                  Period
                </span>
                <span>{apiResponse["Period"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
<<<<<<< HEAD
                <span style={{ fontWeight: "800", minWidth:"250px" }}>
=======
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
>>>>>>> main
                  Min Limit
                </span>
                <span>{apiResponse["Min Expected"]}</span>
              </div>
              <div style={{ display: "flex" }}>
<<<<<<< HEAD
                <span style={{ fontWeight: "800", minWidth:"250px" }}>
=======
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
>>>>>>> main
                  Max Limit
                </span>
                <span>{apiResponse["Max Expected"]}</span>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}

export default Addsensor;
