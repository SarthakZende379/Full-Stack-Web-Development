import { Err, Result } from "cs544-js-utils/dist/lib/errors";
import React, { ChangeEvent, FormEvent, useState, MouseEvent } from "react";
import { PagedValues, makeSensorsWs } from "src/lib/sensors-ws";
interface SearchFormData {
  id?: string;
  sensorTypeId?: string;
}
type AppProps = {
  wsUrl: string;
};
function FindSensor(props: AppProps) {
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    id: "",
    sensorTypeId: "",
  });
  const [fieldError, setFieldError] = useState<Err[] | null>(null);

  const [sensorsData, setSensorsData] = useState<PagedValues | null>();

  const ws = makeSensorsWs(props.wsUrl);
  const handleFindChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFindSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const plainFormData: Record<string, string> = { ...searchFormData };

    try {
      const response: Result<PagedValues> = await ws.findSensorsByReq(
        plainFormData
      );

      // Handle the response as needed
      if (response.isOk) {
        const paginatedValues = response.val;
        setSensorsData(paginatedValues);
      } else {
        setFieldError(response.errors);

        console.error("Error submitting form:", response.errors[0]?.message);
      }

      // setSearchFormData({
      //   id: "",
      //   sensorTypeId: "",
      // });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleFindByLink = async (
    e: MouseEvent<HTMLAnchorElement>,
    link: string | undefined
  ) => {
    console.log("test link");

    e.preventDefault();
    console.log(link);

    if (link == undefined) {
      return;
    }

    try {
      const response: Result<PagedValues> = await ws.findSensorsByRelLink(link);

      // Handle the response as needed
      if (response.isOk) {
        const paginatedValues = response.val;
        setSensorsData(paginatedValues);
        const { values, next, prev } = paginatedValues;
        if (next) {
          console.log("Next Page URL:", next);
        }
        if (values) {
          console.log("Next Page URL:", values);
        }
        if (prev) {
          console.log("Previous Page URL:", prev);
        }
      } else {
        console.error("Error submitting form:", response.errors[0]?.message);
      }

      setSearchFormData({
        id: "",
        sensorTypeId: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div id="findSensors-content" className="tab-content">
        <ul id="findSensors-errors" className="findSensors-errors error">
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
          id="findSensors-form"
          name="findSensors-form"
          onSubmit={handleFindSubmit}
        >
          <label htmlFor="findSensors-id">Sensor ID</label>
          <span>
            <input
              onChange={handleFindChange}
              value={searchFormData.id}
              id="findSensors-id"
              name="id"
            />
            <br />
            <span
              id="findSensors-id-error"
              className="findSensors-errors error"
            ></span>
          </span>
          <label htmlFor="findSensors-sensorTypeId">Sensor Type ID</label>
          <span>
            <input
              onChange={handleFindChange}
              value={searchFormData.sensorTypeId}
              id="findSensors-sensorTypeId"
              name="sensorTypeId"
            />
            <br />
            <span
              id="findSensors-sensorTypeId-error"
              className="findSensors-errors error"
            ></span>
          </span>
          <span></span>
          <button>Find Sensors</button>
        </form>

        <div>
          <div className="scroll">
            {sensorsData?.prev && (
              <a
                href="#"
                onClick={(e) => handleFindByLink(e, `${sensorsData.prev}`)}
              >
                &lt;&lt;
              </a>
            )}
          </div>

          <div
            style={{ display: "flex", justifyContent: "end" }}
            className="scroll"
          >
            {sensorsData?.next && (
              <a
                href="#"
                onClick={(e) => handleFindByLink(e, `${sensorsData.next}`)}
              >
                &gt;&gt;
              </a>
            )}
          </div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
            }}
            id="findSensors-results"
            className="results"
          >
            {sensorsData?.values.map((sensor, index) => (
              <div key={index} style={{ marginBottom: "20px", width: "50%" }}>
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "800", minWidth: "250px" }}>
                    Sensor ID
                  </span>
                  <span>{sensor["Sensor ID"]}</span>
                </div>
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "800", minWidth:"250px" }}>
                    Sensor Type ID
                  </span>
                  <span>{sensor["Sensor Type ID"]}</span>
                </div>
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "800", minWidth:"250px" }}>
                    Period
                  </span>
                  <span>{sensor["Period"]}</span>
                </div>
                <div style={{ display: "flex", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "800", minWidth:"250px" }}>
                    Min Expected
                  </span>
                  <span>{sensor["Min Expected"]}</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ fontWeight: "800", minWidth:"250px" }}>
                    Max Expected
                  </span>
                  <span>{sensor["Max Expected"]}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>{" "}
    </div>
  );
}

export default FindSensor;
