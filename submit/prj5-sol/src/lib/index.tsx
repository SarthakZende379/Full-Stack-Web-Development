import { Errors } from 'cs544-js-utils';

import App from "../components/app.js";

const DEFAULT_WS_URL = 'https://localhost:2345';

import React from 'react';
import * as ReactDOM from 'react-dom/client';



ReactDOM.createRoot(document.querySelector('#app')!)
  .render(<App wsUrl={getWsUrl()}/>);

function getWsUrl() {
  const url = new URL(document.location.href);
  return url?.searchParams?.get('ws-url') ?? DEFAULT_WS_URL;
}
