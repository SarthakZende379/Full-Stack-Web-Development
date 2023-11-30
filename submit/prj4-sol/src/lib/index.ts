import { Errors } from 'cs544-js-utils';

import makeApp from './app.js';

const DEFAULT_WS_URL = 'https://localhost:2345';

window.addEventListener('DOMContentLoaded', async () => {
  makeApp(getWsUrl());
});

function getWsUrl() {
  const url = new URL(document.location.href);
  return url?.searchParams?.get('ws-url') ?? DEFAULT_WS_URL;
}
