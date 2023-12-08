import { Err } from "cs544-js-utils/dist/lib/errors";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { makeSensorsWs } from "src/lib/sensors-ws";

type AppProps = {
  wsUrl: string;
};
interface FormData {
  id: string;
  manufacturer: string;
  modelNumber: string;
  quantity: string;
  unit: string;
  min: number;
  max: number;
}
function AddSensorType(props: AppProps) {
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    manufacturer: "",
    modelNumber: "",
    quantity: "",
    unit: "",
    min: 0,
    max: 0,
  });
  const ws = makeSensorsWs(props.wsUrl);
  const [apiResponse, setApiResponse] = useState<Record<
    string,
    string
  > | null>();
  const [fieldError1, setFieldError1] = useState<Err[] | null>(null);
  const [fieldError, setFieldError] = useState<Err[] | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form fields
    for (const key in formData) {
      if (formData[key as keyof FormData] === "") {
        setFormError(` is required`);
        return;
      }
    }
    const plainFormData: Record<string, string | number> = { ...formData };
    try {
      const response = await ws.addSensorType(plainFormData);
      if (response.isOk) {
        setApiResponse(response.val);
      } else {
        setFieldError1(response.errors);
        console.log(response.errors);
      }
      // setFormData({
      //   id: "",
      //   manufacturer: "",
      //   modelNumber: "",
      //   quantity: "",
      //   unit: "",
      //   max: 0,
      //   min: 0,
      // });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div id="addSensorType" className="tab-content">
      <ul id="addSensorType-errors" className="addSensorType-errors error">
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
        onSubmit={handleSubmit}
      >
        <label htmlFor="addSensorType-id">
          Sensor Type ID
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.id}
            id="addSensorType-id"
            name="id"
          />
          <br />

          <span
            id="addSensorType-id-error"
            className="addSensorType-errors error"
          >
            {formError && (
              <div className="error">"SensorType ID"{formError}</div>
            )}
            {fieldError1 && (
              <div>
                {fieldError1!.map((test, index) => (
                  <div key={index}>
                    {test.options?.widget === "id" && <p>{test.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </span>
        </span>
        <label htmlFor="addSensorType-manufacturer">
          Manufacturer
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.manufacturer}
            id="addSensorType-manufacturer"
            name="manufacturer"
          />
          <br />
          <span
            id="addSensorType-manufacturer-error"
            className="addSensorType-errors error"
          >
            {formError && <div className="error">"manufacturer{formError}</div>}
          </span>
        </span>
        <label htmlFor="addSensorType-modelNumber">
          Model Number
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.modelNumber}
            id="addSensorType-modelNumber"
            name="modelNumber"
          />
          <br />
          <span
            id="addSensorType-modelNumber-error"
            className="addSensorType-errors error"
          >
            {formError && <div className="error">"modelNumber"{formError}</div>}
          </span>
        </span>
        <label htmlFor="addSensorType-quantity">
          Quantity
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.quantity}
            id="addSensorType-quantity"
            name="quantity"
          />
          <br />
          <span
            id="addSensorType-quantity-error"
            className="addSensorType-errors error"
          >
            {formError && <div className="error">"quantity"{formError}</div>}
          </span>
        </span>
        <label htmlFor="addSensorType-unit">
          Unit{" "}
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.unit}
            id="addSensorType-unit"
            name="unit"
          />
          <br />
          <span
            id="addSensorType-unit-error"
            className="addSensorType-errors error"
          >
            {formError && <div className="error">"unit"{formError}</div>}
          </span>
        </span>
        <label htmlFor="addSensorType-min">
          Min Limit
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.min}
            id="addSensorType-min"
            name="min"
            type="number"
          />
          <br />
          <span id="min" className="addSensorType-errors error">
            {formError && (
              <div id="min" className="error">
                "min" {formError}
              </div>
            )}
          </span>
        </span>
        <label htmlFor="addSensorType-max">
          Max Limit
          <span className="required" title="Required">
            *
          </span>
        </label>
        <span>
          <input
            onChange={handleChange}
            value={formData.max}
            id="addSensorType-max"
            name="max"
            type="number"
          />
          <br />
          <span id="max" className="addSensorType-errors error">
            {" "}
            {formError && <div className="error">"max"{formError}</div>}
          </span>
        </span>
        <span></span>
        <button>Add Sensor Type</button>
      </form>
      <div id="addSensorType-results" className="results">
        {apiResponse && (
          <div
            style={{
              marginLeft: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Sensor Type ID
              </span>
              <span>{apiResponse["Sensor Type ID"]}</span>
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Manufacturer
              </span>
              <span>{apiResponse["Manufacturer"]}</span>
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Model Number
              </span>
              <span>{apiResponse["Model Number"]}</span>
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Quantity
              </span>
              <span>{apiResponse["Quantity"]}</span>
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Unit
              </span>
              <span>{apiResponse["Unit"]}</span>
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Min Limit
              </span>
              <span>{apiResponse["Min Limit"]}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "900", minWidth:"250px" }}>
                Max Limit
              </span>
              <span>{apiResponse["Max Limit"]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSensorType;
