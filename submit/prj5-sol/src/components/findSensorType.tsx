import React, { ChangeEvent, FormEvent, useState, MouseEvent } from "react";
import { SensorType } from "src/lib/validators";
import { PagedValues, makeSensorsWs } from "src/lib/sensors-ws";
import { Err, Result } from "cs544-js-utils/dist/lib/errors";

type AppProps = {
  wsUrl: string;
};

interface SearchFormFindData {
  id?: string;
  manufacturer?: string;
  modelNumber?: string;
  quantity?: string;
  unit?: string;
}
function FindSensorType(props: AppProps) {
  const [findSensorType, setFindSensorType] = useState<SearchFormFindData>({
    id: "",
    manufacturer: "",
    modelNumber: "",
    quantity: "",
    unit: "",
  });
  const [fieldError, setFieldError] = useState<Err[] | null>(null);
  const [fieldError1, setFieldError1] = useState<Err[] | null>(null);
  const [fieldError2, setFieldError2] = useState<Err[] | null>(null);
  const [sensorsData, setSensorsData] = useState<PagedValues | null>();

  const ws = makeSensorsWs(props.wsUrl);

  //  FINDSENSOR TYPES
  const handleFindTypesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFindSensorType((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFindTypesSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const plainFormData: Record<string, string> = { ...findSensorType };
    for (const key in plainFormData) {
      if (plainFormData[key as keyof SearchFormFindData] === "") {
        delete plainFormData[key];
      }
    }
    try {
      const response: Result<PagedValues> = await ws.findSensorTypesByReq(
        plainFormData
      );
      console.log(response);

      // Handle the response as needed
      if (response.isOk) {
        const paginatedValues: PagedValues = response.val;
        setSensorsData(paginatedValues);
      } else {
        setFieldError(response.errors);

        console.log(response.errors);
      }

      // setFindSensorType({
      //   id: "",
      //   manufacturer: "",
      //   modelNumber: "",
      //   quantity: "",
      //   unit: "",
      // });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleFindSensorTypeByLink = async (
    e: MouseEvent<HTMLAnchorElement>,
    link: string | undefined
  ) => {
    e.preventDefault();

    if (link == undefined) {
      return;
    }

    try {
      const response: Result<PagedValues> = await ws.findSensorTypesByRelLink(
        link
      );

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
        setFieldError(response.errors);
        console.error("Error submitting form:", response.errors[0]?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div id="findSensorTypes-content" className="tab-content">
        <ul
          id="findSensorTypes-errors"
          className="findSensorTypes-errors error"
        >
          {" "}
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
          id="findSensorTypes-form"
          name="findSensorTypes-form"
          onSubmit={handleFindTypesSubmit}
        >
          <label htmlFor="findSensorTypes-id">Sensor Type ID</label>
          <span>
            <input
              onChange={handleFindTypesChange}
              value={findSensorType.id}
              id="findSensorTypes-id"
              name="id"
            />
            <br />
            <span
              id="findSensorTypes-id-error"
              className="findSensorTypes-errors error"
            ></span>
          </span>
          <label htmlFor="findSensorTypes-manufacturer">Manufacturer</label>
          <span>
            <input
              onChange={handleFindTypesChange}
              value={findSensorType.manufacturer}
              id="findSensorTypes-manufacturer"
              name="manufacturer"
            />
            <br />
            <span
              id="findSensorTypes-manufacturer-error"
              className="findSensorTypes-errors error"
            ></span>
          </span>
          <label htmlFor="findSensorTypes-modelNumber">Model Number</label>
          <span>
            <input
              onChange={handleFindTypesChange}
              value={findSensorType.modelNumber}
              id="findSensorTypes-modelNumber"
              name="modelNumber"
            />
            <br />
            <span
              id="findSensorTypes-modelNumber-error"
              className="findSensorTypes-errors error"
            ></span>
          </span>
          <label htmlFor="findSensorTypes-quantity">Quantity</label>
          <span>
            <input
              onChange={handleFindTypesChange}
              value={findSensorType.quantity}
              id="findSensorTypes-quantity"
              name="quantity"
            />
            <br />
            <span
              id="findSensorTypes-quantity-error"
              className="findSensorTypes-errors error"
            ></span>
          </span>
          <label htmlFor="findSensorTypes-unit">Unit</label>
          <span>
            <input
              onChange={handleFindTypesChange}
              value={findSensorType.unit}
              id="findSensorTypes-unit"
              name="unit"
            />
            <br />
            <span
              id="findSensorTypes-unit-error"
              className="findSensorTypes-errors error"
            ></span>
          </span>
          <span></span>
          <button>Find Sensor Types</button>
        </form>

        <div className="scroll">
          {sensorsData?.prev && (
            <a
              href="#"
              onClick={(e) =>
                handleFindSensorTypeByLink(e, `${sensorsData.prev}`)
              }
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
              onClick={(e) =>
                handleFindSensorTypeByLink(e, `${sensorsData.next}`)
              }
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
            <div
              key={index}
              style={{
                marginBottom: "20px",
                width: "50%",
              }}
            >
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  SensorType ID
                </span>
                <span>{sensor["Sensor Type ID"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Manufacturer
                </span>
                <span>{sensor["Manufacturer"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Model Number
                </span>
                <span>{sensor["Model Number"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Quantity
                </span>
                <span>{sensor["Quantity"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Unit
                </span>
                <span>{sensor["Unit"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Min Limit
                </span>
                <span>{sensor["Min Limit"]}</span>
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <span style={{ fontWeight: "800", minWidth: "250px" }}>
                  Max Limit:
                </span>
                <span>{sensor["Max Limit"]}</span>
              </div>
            </div>
          ))}
        </ul>
      </div>{" "}
    </div>
  );
}

export default FindSensorType;
