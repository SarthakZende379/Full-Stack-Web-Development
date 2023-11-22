import { makeElement } from './utils.js';

export default function init() {
  const app = document.querySelector('#app')!;
  const tabs = makeElement('div', { class: 'tabs' });
  app.append(tabs);
  for (const [rootId, info] of Object.entries(TABS)) {
    tabs.append(makeTab(rootId, info));
  }
}


function makeTab(rootId: string, tabInfo: TabInfo) {
  const section = makeElement('section', { class: 'tab' });
  const tabId = `${rootId}-tab`;
  const input = makeElement('input',
			    { type: 'radio', name: "tab", class: 'tab-control',
			      id: tabId, value: tabId });
  section.append(input);
  const h1 = makeElement('h1', { class: 'tab-title' });
  section.append(h1);
  const label = makeElement('label', {for: tabId}, tabInfo.label);
  h1.append(label);
  const div =
    makeElement('div', { id: `${rootId}-content`, class: 'tab-content' });
  section.append(div);
  const globErrAttrs = { id: `${rootId}-errors`, class: `${rootId}-errors` };
  div.append(makeElement('ul', globErrAttrs));
  div.append(makeForm(rootId, tabInfo.form));
  const resultsAttrs = {id: `${rootId}-results`, class: 'results' };
  if (tabInfo.isFind) {
    const scroll0 = makeElement('div', { class: 'scroll' });
    const prevAttrs = { class: 'hide', rel: 'prev', href: '#' };
    const nextAttrs = { class: 'hide', rel: 'next', href: '#' };
    scroll0.append(makeElement('a', prevAttrs, '<<'));
    scroll0.append(makeElement('a', nextAttrs, '>>'));
    const ul = makeElement('ul', resultsAttrs);
    const scroll1 = makeElement('div', { class: 'scroll' });
    scroll1.append(makeElement('a', prevAttrs, '<<'));
    scroll1.append(makeElement('a', nextAttrs, '>>'));
    div.append(scroll0, ul, scroll1);
  }
  else {
    div.append(makeElement('div', resultsAttrs));
  }
  return section;
}

function makeForm(rootId: string, formInfo: FormInfo) {
  const form = makeElement('form', {class: 'grid-form', id: `${rootId}-form`});
  for (const [id, info] of Object.entries(formInfo.fields)) {
    const widgetId = `${rootId}-${id}`;
    const label = makeElement('label', { for: widgetId }, info.label);
    form.append(label);
    if (info.required) {
      const required =
	makeElement('span', {class: 'required', title: 'Required'}, '*');
      label.append(required);
    }
    const span = makeElement('span');
    form.append(span);
    const inputAttr: Record<string, string> = { id: widgetId, name: id };
    if (info.type) inputAttr.type = info.type;
    const input = makeElement('input', inputAttr);
    span.append(input); span.append(makeElement('br'));
    const errAttrs = {
      id: `${rootId}-${id}-error`,
      class: `${rootId}-errors error`,
    };
    const err = makeElement('span', errAttrs);
    span.append(err);
  }
  form.append(makeElement('span'), makeElement('button', {}, formInfo.submit));
  return form;
}

type FieldInfo = {
  label: string,
  required?: boolean,
  'type'?: string,
};

type FormInfo = {
  submit: string,
  fields: Record<string, FieldInfo>,
};

type TabInfo = {
  label: string,
  isFind?: boolean,
  form: FormInfo,
};


const TABS: Record<string, TabInfo> = {

  addSensorType: {
    label: 'Add Sensor Type',
    form: {
      fields: {
	id: { label: 'Sensor Type ID', required: true, },
	manufacturer: {  label: 'Manufacturer', required: true, },
	modelNumber: { label: 'Model Number', required: true, },
	quantity: { label: 'Quantity', required: true, },
	unit: { label: 'Unit', required: true, },
	min: { label: 'Min Limit', required: true, type: 'number', },
	max: { label: 'Max Limit', required: true, type: 'number', },
      },
      submit: 'Add Sensor Type',
    },
  },
  
  addSensor: {
    label: 'Add Sensor',
    form: {
      fields: {
	id: { label: 'Sensor ID', required: true,  },
	sensorTypeId: { label: 'Sensor Type ID', required: true,  },
	period: { label: 'Period', required: true, type: 'number', },
	min: { label: 'Min Expected', required: true, type: 'number', },
	max: { label: 'Max Expected', required: true, type: 'number', },
      },
      submit: 'Add Sensor',
    },
  },

  findSensorTypes: {
    label: 'Find Sensor Types',
    isFind: true,
    form: {
      fields: {
	id: { label: 'Sensor Type ID', },
	manufacturer: {  label: 'Manufacturer', },
	modelNumber: { label: 'Model Number', },
	quantity: { label: 'Quantity', },
	unit: { label: 'Unit', },
      },
      submit: 'Find Sensor Types',
    },
  },

  findSensors: {
    label: 'Find Sensor',
    isFind: true,
    form: {
      fields: {
	id: { label: 'Sensor ID',  },
	sensorTypeId: { label: 'Sensor Type ID',  },
      },
      submit: 'Find Sensors',
    },
  },

};


