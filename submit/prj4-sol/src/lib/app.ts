import { Errors } from "cs544-js-utils";
import { PagedValues, makeSensorsWs, SensorsWs } from "./sensors-ws.js";

import init from "./init.js";
import { makeElement, getFormData } from "./utils.js";
import { checkField } from "cs544-js-utils/dist/lib/checkers.js";

export default function makeApp(wsUrl: string) {
    const ws = makeSensorsWs(wsUrl);
    init();
    //TODO: add call to select initial tab and calls to set up
    //form submit listeners

    // Select add sensor type at start
    selectTab("addSensorType");

    // Event listener to add sensor type
    const addSensorTypeForm = document.querySelector("#addSensorType-form") as HTMLFormElement;
    if (addSensorTypeForm) {
        addSensorTypeForm.onsubmit = async (event: SubmitEvent) => {
            event.preventDefault();
            clearErrors("addSensorType");
            clearResults("addSensorType");
            const formData = getFormData(addSensorTypeForm);
            const response = await ws.addSensorType(formData);
            if (response.isOk) {
                displayResultSingle("addSensorType", response.val);
            } else {
                displayErrors("addSensorType", response.errors);
            }
        };
    }

    // Event listener to add sensor
    const addSensorForm = document.querySelector("#addSensor-form") as HTMLFormElement;
    if (addSensorForm) {
        addSensorForm.onsubmit = async (event: SubmitEvent) => {
            event.preventDefault();
            clearErrors("addSensor");
            clearResults("addSensor");
            const formData = getFormData(addSensorForm);
            const response = await ws.addSensor(formData);
            if (response.isOk) {
                displayResultSingle("addSensor", response.val);
            } else {
                displayErrors("addSensor", response.errors);
            }
        };
    }

    // Event listener to find Sensor Type
    const findSensorTypeForm = document.querySelector("#findSensorTypes-form") as HTMLFormElement;
    if (findSensorTypeForm) {
        findSensorTypeForm.onsubmit = async (event: SubmitEvent) => {
            event.preventDefault();
            clearErrors("findSensorTypes");
            clearResults("findSensorTypes");
            const formData = getFormData(findSensorTypeForm);
            const response = await ws.findSensorTypesByReq(formData);
            if (response.isOk) {
                displayResultMulti("findSensorTypes", response.val, ws.findSensorTypesByRelLink.bind(ws));
            } else {
                displayErrors("findSensorTypes", response.errors);
            }
        };
    }

    // Event listener to find Sensor
    const findSensorForm = document.querySelector("#findSensors-form") as HTMLFormElement;
    if (findSensorForm) {
        findSensorForm.onsubmit = async (event: SubmitEvent) => {
            event.preventDefault();
            clearErrors("findSensors");
            clearResults("findSensors");
            const formData = getFormData(findSensorForm);
            const response = await ws.findSensorsByReq(formData);
            if (response.isOk) {
                displayResultMulti("findSensors", response.val, ws.findSensorsByRelLink.bind(ws));
            } else {
                displayErrors("findSensors", response.errors);
            }
        };
    }


//TODO: functions to select a tab and set up form submit listeners

/** clear out all errors within tab specified by rootId */
function clearErrors(rootId: string) {
    document.querySelectorAll(`.${rootId}-errors`).forEach((el) => {
        el.innerHTML = "";
    });
}

/** Display errors for rootId.  If an error has a widget widgetId such
 *  that an element having ID `${rootId}-${widgetId}-error` exists,
 *  then the error message is added to that element; otherwise the
 *  error message is added to the element having to the element having
 *  ID `${rootId}-errors` wrapped within an `<li>`.
 */
function displayErrors(rootId: string, errors: Errors.Err[]) {
    for (const err of errors) {
        const id = err.options.widget;
        const widget = id && document.querySelector(`#${rootId}-${id}-error`);
        if (widget) {
            widget.append(err.message);
        } else {
            const li = makeElement("li", { class: "error" }, err.message);
            document.querySelector(`#${rootId}-errors`)!.append(li);
        }
    }
}
// Function to display a single result
function displayResultSingle(rootId: string, results: Record<string, string>) {
    const resultWidget = document.getElementById(`${rootId}-results`);
    if (resultWidget) {
        const dlElement = makeElement("dl", { class: "result" }, "");
        for (let [key, value] of Object.entries(results)) {
            dlElement.appendChild(makeElement("dt", {}, key));
            dlElement.appendChild(makeElement("dd", {}, value));
        }
        resultWidget.appendChild(dlElement);
    }
}

// Function to display multiple results
function displayResultMulti(rootId: string, results: PagedValues, linkFn: (relLink: string) => Promise<Errors.Result<PagedValues>>) {
    const resultWidget = document.getElementById(`${rootId}-results`);
    if (resultWidget) {
        for (let element of results.values) {
            const dlElement = makeElement("dl", { class: "result" }, "");
            for (let [key, value] of Object.entries(element)) {
                dlElement.appendChild(makeElement("dt", {}, key));
                dlElement.appendChild(makeElement("dd", {}, value));
            }
            resultWidget.appendChild(dlElement);
        }
    }

    const contentElement = document.getElementById(`${rootId}-content`);
    if (contentElement) {
        const nextScrollOG = contentElement.querySelector('[rel="next"]');
        const prevScrollOG = contentElement.querySelector('[rel="prev"]');
        if (nextScrollOG && prevScrollOG) {
            const nextScroll = nextScrollOG.cloneNode(true) as HTMLElement;
            const prevScroll = prevScrollOG.cloneNode(true) as HTMLElement;

            if (results && results.next) {
                setVisibility(nextScroll, true);
                nextScroll.onclick = async () => {
                    clearResults(rootId);
                    const apiResponse = await linkFn(results.next!);
                    if (apiResponse && apiResponse.isOk) {
                        displayResultMulti(rootId, apiResponse.val, linkFn);
                    } else {
                        apiResponse && displayErrors(rootId, apiResponse.errors);
                    }
                };
            } else {
                setVisibility(nextScroll, false);
            }

            if (results && results.prev) {
                setVisibility(prevScroll, true);
                prevScroll.onclick = async () => {
                    clearResults(rootId);
                    const apiResponse = await linkFn(results.prev!);
                    if (apiResponse && apiResponse.isOk) {
                        displayResultMulti(rootId, apiResponse.val, linkFn);
                    } else {
                        apiResponse && displayErrors(rootId, apiResponse.errors);
                    }
                };
            } else {
                setVisibility(prevScroll, false);
            }

            if (nextScrollOG.parentNode && prevScrollOG.parentNode) {
                nextScrollOG.parentNode.replaceChild(nextScroll, nextScrollOG);
                prevScrollOG.parentNode.replaceChild(prevScroll, prevScrollOG);
            }
        }
    }
}

// Function to clear the results div
function clearResults(rootId: string) {
    const resultWidget = document.getElementById(`${rootId}-results`);
    if (resultWidget) {
        while (resultWidget.firstChild) {
            resultWidget.removeChild(resultWidget.firstChild);
        }
    }
}

/** Turn visibility of element on/off based on isVisible.  This
 *  is done by adding class "show" or "hide".  It presupposes
 *  that "show" and "hide" are set up with appropriate CSS styles.
 */
function setVisibility(element: HTMLElement, isVisible: boolean) {
    element.classList.add(isVisible ? "show" : "hide");
    element.classList.remove(isVisible ? "hide" : "show");
}

// Function to select a tab for initial selection
function selectTab(rootId: string) {
    const tabWidget = document.getElementById(`${rootId}-tab`) as HTMLInputElement;
    if (tabWidget) {
        tabWidget.checked = true;
    }
}
}