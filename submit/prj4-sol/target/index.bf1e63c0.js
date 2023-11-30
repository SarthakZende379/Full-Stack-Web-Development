// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"dbtGE":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "40af12ebbf1e63c0";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"CnCET":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _appJs = require("./app.js");
var _appJsDefault = parcelHelpers.interopDefault(_appJs);
const DEFAULT_WS_URL = "https://localhost:2345";
window.addEventListener("DOMContentLoaded", async ()=>{
    (0, _appJsDefault.default)(getWsUrl());
});
function getWsUrl() {
    const url = new URL(document.location.href);
    return url?.searchParams?.get("ws-url") ?? DEFAULT_WS_URL;
}

},{"./app.js":"6wtUX","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6wtUX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>makeApp);
var _sensorsWsJs = require("./sensors-ws.js");
var _initJs = require("./init.js");
var _initJsDefault = parcelHelpers.interopDefault(_initJs);
var _utilsJs = require("./utils.js");
function makeApp(wsUrl) {
    const ws = (0, _sensorsWsJs.makeSensorsWs)(wsUrl);
    (0, _initJsDefault.default)();
    //TODO: add call to select initial tab and calls to set up
    //form submit listeners
    // Select add sensor type at start
    selectTab("addSensorType");
    // Event listener to add sensor type
    const addSensorTypeForm = document.querySelector("#addSensorType-form");
    if (addSensorTypeForm) addSensorTypeForm.onsubmit = async (event)=>{
        event.preventDefault();
        clearErrors("addSensorType");
        clearResults("addSensorType");
        const formData = (0, _utilsJs.getFormData)(addSensorTypeForm);
        const response = await ws.addSensorType(formData);
        if (response.isOk) displayResultSingle("addSensorType", response.val);
        else displayErrors("addSensorType", response.errors);
    };
    // Event listener to add sensor
    const addSensorForm = document.querySelector("#addSensor-form");
    if (addSensorForm) addSensorForm.onsubmit = async (event)=>{
        event.preventDefault();
        clearErrors("addSensor");
        clearResults("addSensor");
        const formData = (0, _utilsJs.getFormData)(addSensorForm);
        const response = await ws.addSensor(formData);
        if (response.isOk) displayResultSingle("addSensor", response.val);
        else displayErrors("addSensor", response.errors);
    };
    // Event listener to find Sensor Type
    const findSensorTypeForm = document.querySelector("#findSensorTypes-form");
    if (findSensorTypeForm) findSensorTypeForm.onsubmit = async (event)=>{
        event.preventDefault();
        clearErrors("findSensorTypes");
        clearResults("findSensorTypes");
        const formData = (0, _utilsJs.getFormData)(findSensorTypeForm);
        const response = await ws.findSensorTypesByReq(formData);
        if (response.isOk) displayResultMulti("findSensorTypes", response.val, ws.findSensorTypesByRelLink.bind(ws));
        else displayErrors("findSensorTypes", response.errors);
    };
    // Event listener to find Sensor
    const findSensorForm = document.querySelector("#findSensors-form");
    if (findSensorForm) findSensorForm.onsubmit = async (event)=>{
        event.preventDefault();
        clearErrors("findSensors");
        clearResults("findSensors");
        const formData = (0, _utilsJs.getFormData)(findSensorForm);
        const response = await ws.findSensorsByReq(formData);
        if (response.isOk) displayResultMulti("findSensors", response.val, ws.findSensorsByRelLink.bind(ws));
        else displayErrors("findSensors", response.errors);
    };
    //TODO: functions to select a tab and set up form submit listeners
    /** clear out all errors within tab specified by rootId */ function clearErrors(rootId) {
        document.querySelectorAll(`.${rootId}-errors`).forEach((el)=>{
            el.innerHTML = "";
        });
    }
    /** Display errors for rootId.  If an error has a widget widgetId such
     *  that an element having ID `${rootId}-${widgetId}-error` exists,
     *  then the error message is added to that element; otherwise the
     *  error message is added to the element having to the element having
     *  ID `${rootId}-errors` wrapped within an `<li>`.
     */ function displayErrors(rootId, errors) {
        for (const err of errors){
            const id = err.options.widget;
            const widget = id && document.querySelector(`#${rootId}-${id}-error`);
            if (widget) widget.append(err.message);
            else {
                const li = (0, _utilsJs.makeElement)("li", {
                    class: "error"
                }, err.message);
                document.querySelector(`#${rootId}-errors`).append(li);
            }
        }
    }
    // Function to display a single result
    function displayResultSingle(rootId, results) {
        const resultWidget = document.getElementById(`${rootId}-results`);
        if (resultWidget) {
            const dlElement = (0, _utilsJs.makeElement)("dl", {
                class: "result"
            }, "");
            for (let [key, value] of Object.entries(results)){
                dlElement.appendChild((0, _utilsJs.makeElement)("dt", {}, key));
                dlElement.appendChild((0, _utilsJs.makeElement)("dd", {}, value));
            }
            resultWidget.appendChild(dlElement);
        }
    }
    // Function to display multiple results
    function displayResultMulti(rootId, results, linkFn) {
        const resultWidget = document.getElementById(`${rootId}-results`);
        if (resultWidget) for (let element of results.values){
            const dlElement = (0, _utilsJs.makeElement)("dl", {
                class: "result"
            }, "");
            for (let [key, value] of Object.entries(element)){
                dlElement.appendChild((0, _utilsJs.makeElement)("dt", {}, key));
                dlElement.appendChild((0, _utilsJs.makeElement)("dd", {}, value));
            }
            resultWidget.appendChild(dlElement);
        }
        const contentElement = document.getElementById(`${rootId}-content`);
        if (contentElement) {
            const nextScrollOG = contentElement.querySelector('[rel="next"]');
            const prevScrollOG = contentElement.querySelector('[rel="prev"]');
            if (nextScrollOG && prevScrollOG) {
                const nextScroll = nextScrollOG.cloneNode(true);
                const prevScroll = prevScrollOG.cloneNode(true);
                if (results && results.next) {
                    setVisibility(nextScroll, true);
                    nextScroll.onclick = async ()=>{
                        clearResults(rootId);
                        const apiResponse = await linkFn(results.next);
                        if (apiResponse && apiResponse.isOk) displayResultMulti(rootId, apiResponse.val, linkFn);
                        else apiResponse && displayErrors(rootId, apiResponse.errors);
                    };
                } else setVisibility(nextScroll, false);
                if (results && results.prev) {
                    setVisibility(prevScroll, true);
                    prevScroll.onclick = async ()=>{
                        clearResults(rootId);
                        const apiResponse = await linkFn(results.prev);
                        if (apiResponse && apiResponse.isOk) displayResultMulti(rootId, apiResponse.val, linkFn);
                        else apiResponse && displayErrors(rootId, apiResponse.errors);
                    };
                } else setVisibility(prevScroll, false);
                if (nextScrollOG.parentNode && prevScrollOG.parentNode) {
                    nextScrollOG.parentNode.replaceChild(nextScroll, nextScrollOG);
                    prevScrollOG.parentNode.replaceChild(prevScroll, prevScrollOG);
                }
            }
        }
    }
    // Function to clear the results div
    function clearResults(rootId) {
        const resultWidget = document.getElementById(`${rootId}-results`);
        if (resultWidget) while(resultWidget.firstChild)resultWidget.removeChild(resultWidget.firstChild);
    }
    /** Turn visibility of element on/off based on isVisible.  This
     *  is done by adding class "show" or "hide".  It presupposes
     *  that "show" and "hide" are set up with appropriate CSS styles.
     */ function setVisibility(element, isVisible) {
        element.classList.add(isVisible ? "show" : "hide");
        element.classList.remove(isVisible ? "hide" : "show");
    }
    // Function to select a tab for initial selection
    function selectTab(rootId) {
        const tabWidget = document.getElementById(`${rootId}-tab`);
        if (tabWidget) tabWidget.checked = true;
    }
}

},{"./sensors-ws.js":"idyXz","./init.js":"kUKFB","./utils.js":"3cCYB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"idyXz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "makeSensorsWs", ()=>makeSensorsWs);
parcelHelpers.export(exports, "SensorsWs", ()=>SensorsWs);
var _cs544JsUtils = require("cs544-js-utils");
function makeSensorsWs(url) {
    return new SensorsWs(url);
}
class SensorsWs {
    //base url for these web services
    url;
    constructor(url){
        this.url = url;
    }
    /** Use web-services to create a sensor-type based on the parameters
     *  specified in req.  If the response envelope is in error, then
     *  return the errors within the Result object.  Otherwise, return a
     *  success Result containing the information in the success
     *  envelope converted to a display sensor-type.
     */ async addSensorType(req) {
        const url = new URL(`${this.url}/sensors-info/sensor-types`);
        return addData(url, req, makeSensorTypeDisplay);
    }
    /** Use web-services to create a sensor based on the parameters
     *  specified in req.  If the response envelope is in error, then
     *  return the errors within the Result object.  Otherwise, return a
     *  success Result containing the information in the success
     *  envelope converted to a display sensor.
     */ async addSensor(req) {
        const url = new URL(`${this.url}/sensors-info/sensors`);
        return addData(url, req, makeSensorDisplay);
    }
    /** Return the next page of display sensor-types using the absolute URL
     *  constructed by concatenating relLink to the base URL for these
     *  web services. The success return will possibly contain next
     *  and prev relative URLs returned in the response, as well as
     *  the returned sensor-types converted to display sensor-types.
     */ async findSensorTypesByRelLink(relLink) {
        return findData(new URL(this.url + relLink), makeSensorTypeDisplay);
    }
    /** Return the first page of display sensor-types based on the
     *  search request req.  The success return will possibly contain next
     *  and prev relative URLs returned in the response, as well as
     *  the returned sensor-types converted to display sensor-types.
     */ async findSensorTypesByReq(req) {
        const baseUrl = `${this.url}/sensors-info/sensor-types`;
        return findData(makeQueryUrl(baseUrl, req), makeSensorTypeDisplay);
    }
    /** Return the next page of display sensors using the absolute URL
     *  constructed by concatenating relLink to the base URL for these
     *  web services. The success return will possibly contain next
     *  and prev relative URLs returned in the response, as well as
     *  the returned sensor-types converted to display sensors.
     */ async findSensorsByRelLink(relLink) {
        return findData(new URL(this.url + relLink), makeSensorDisplay);
    }
    /** Return the first page of display sensors based on the search
     *  request req.  The success return will possibly contain next and
     *  prev relative URLs returned in the response, as well as the
     *  returned sensor-types converted to display sensors.
     */ async findSensorsByReq(req) {
        const baseUrl = `${this.url}/sensors-info/sensors`;
        return findData(makeQueryUrl(baseUrl, req), makeSensorDisplay);
    }
}
/** Make a suitable request to the web services at URL url to
 *  create a sensor-type or sensor with parameters specified by data.
 *  If the web request results in an error or returns an error
 *  envelope, then return an error Result containing suitable errors.
 *  Otherwise return an ok Result containing the results of the displayFn
 *  applied to the result from the success envelope.
 */ async function addData(url, data, displayFn) {
    let response;
    try {
        response = await fetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    } catch (err) {
        return (0, _cs544JsUtils.Errors).errResult(err);
    }
    let jsonData;
    try {
        jsonData = await response.json();
    } catch (err) {
        return (0, _cs544JsUtils.Errors).errResult(err);
    }
    if (jsonData && jsonData.isOk) return (0, _cs544JsUtils.Errors).okResult(displayFn(jsonData.result));
    else {
        const error = jsonData ? new (0, _cs544JsUtils.Errors).ErrResult(jsonData.errors) : (0, _cs544JsUtils.Errors).errResult("Unknown error");
        return error;
    }
}
/** Make a suitable request to the web services at URL url to
 *  find sensor-types or sensors matching the query parameters in url.
 *  If the web request results in an error or returns an error
 *  envelope, then return an error Result containing suitable errors.
 *  Otherwise return an ok Result containing the results of the displayFn
 *  applied to the result array from the success envelope along with
 *  any next and prev href's.
 */ async function findData(url, displayFn) {
    let response;
    try {
        response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        return (0, _cs544JsUtils.Errors).errResult(err);
    }
    let jsonData;
    try {
        jsonData = await response.json();
    } catch (err) {
        return (0, _cs544JsUtils.Errors).errResult(err);
    }
    if (jsonData.isOk) {
        const values = [
            ...jsonData.result
        ].map((e)=>{
            return displayFn(e.result);
        });
        const next = jsonData?.links?.next?.href;
        const prev = jsonData?.links?.prev?.href;
        return (0, _cs544JsUtils.Errors).okResult({
            values,
            next,
            prev
        });
    } else return new (0, _cs544JsUtils.Errors).ErrResult(jsonData.errors);
}
/** Given a baseUrl and req, return a URL object which contains
 *  req as query-parameters appended to baseUrl.
 */ function makeQueryUrl(baseUrl, req) {
    const url = new URL(baseUrl);
    Object.entries(req).forEach(([k, v])=>url.searchParams.append(k, v));
    return url;
}
/** Given a sensorType having data from SensorType, return an object
 *  mapping strings describing the fields to their string values.
 */ function makeSensorTypeDisplay(sensorType) {
    return {
        "Sensor Type ID": sensorType.id,
        Manufacturer: sensorType.manufacturer,
        "Model Number": sensorType.modelNumber,
        Quantity: sensorType.quantity,
        Unit: sensorType.unit,
        "Min Limit": sensorType.limits.min.toString(),
        "Max Limit": sensorType.limits.max.toString()
    };
}
/** Given a sensor having data from Sensor, return an object mapping
 *  strings describing the fields to their string values.
 */ function makeSensorDisplay(sensor) {
    return {
        "Sensor ID": sensor.id,
        "Sensor Type ID": sensor.sensorTypeId,
        Period: sensor.period.toString(),
        "Min Expected": sensor.expected.min.toString(),
        "Max Expected": sensor.expected.max.toString()
    };
}

},{"cs544-js-utils":"8WQYV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8WQYV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Errors", ()=>_errorsJs);
parcelHelpers.export(exports, "Checkers", ()=>_checkersJs);
var _errorsJs = require("./lib/errors.js");
var _checkersJs = require("./lib/checkers.js");

},{"./lib/errors.js":"aGjnO","./lib/checkers.js":"aWjit","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aGjnO":[function(require,module,exports) {
// Immutable API
/** throw exception with msg and args; use when impossible conditions occur */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "panic", ()=>panic);
parcelHelpers.export(exports, "Err", ()=>Err);
/** A Result is either a success result identified by isOk=true,
 *  or an error result identified by isOk=false.  A success
 *  result has the success value in its 'val' property; an
 *  error result will have one or more 'Err' objects in its
 *  'errors' property.
 */ parcelHelpers.export(exports, "OkResult", ()=>OkResult);
parcelHelpers.export(exports, "ErrResult", ()=>ErrResult);
/** factory function for a success result */ parcelHelpers.export(exports, "okResult", ()=>okResult);
parcelHelpers.export(exports, "VOID_RESULT", ()=>VOID_RESULT);
/** factory function for an error result initialized to contain
 *  a single error as per arg0, args.
 *    errResult(msg: string, code?: string, widget?: string)
 *    errResult(msg: string, options: ErrOptions)
 *    errResult(err: Err)
 *    errResult(err: ErrResult, options: ErrOptions)
 *    errResult(errObj: object, options: ErrOptions)
 */ parcelHelpers.export(exports, "errResult", ()=>errResult);
/** Convenience error building function.  Possible arguments:
 *     error(msg: string, code?: string, widget?: string)
 *     error(msg: string, options: ErrOptions)
 *     error(err: Err)
 *     error(err: Error, options?: ErrOptions)
 *     error(errObj: object, options?: ErrOptions)
 */ parcelHelpers.export(exports, "error", ()=>error) /*
//demo program

function safeDiv(num: number, denom: number) : Result<number> {
  if (denom === 0) return errResult('zero denominator');
  return okResult(num/denom);
}

function demo(result: Result<number>) : Result<string> {
  if (!result.isOk) return result as Result<string>;
  const v = result.val + 1;
  return result.chain((val: number) => okResult('x'.repeat(v*val)))
               .chain((str: string) => okResult(str + 'aaa'));
}

console.log(safeDiv(1, 0));
console.log(safeDiv(1, 2));
console.log(demo(errResult('some error', 'ERR_CODE')));
console.log(demo(okResult(2)));
*/ ;
function panic(msg, ...args) {
    throw new Error(msg + args.map((a)=>JSON.stringify(a)).join(", "));
}
const DEFAULT_ERR_CODE = "UNKNOWN";
class Err {
    message;
    options;
    constructor(message, options){
        this.message = message;
        this.options = options;
    }
}
class OkResult {
    isOk = true;
    val;
    constructor(v){
        this.val = v;
    }
    /** return result of applying fn on val */ chain(fn) {
        return fn(this.val);
    }
}
class ErrResult {
    isOk = false;
    errors;
    constructor(errors = []){
        this.errors = errors;
    }
    /** Possible arguments
     *   addError(ErrResult errResult)
     *   addError(msg: string, code?: string, widget?: string)
     *   addError(msg: string, options: ErrOptions)
     *   addError(err: Err)
     *   addError(err: Error, options?: ErrOptions)
     *   addError(errObj: object, options?: ErrOptions)
     */ addError(arg0, ...args) {
        const errors = arg0 instanceof ErrResult ? arg0.errors : [
            error(arg0, ...args)
        ];
        return new ErrResult(this.errors.concat(errors));
    }
    /** ignore fn, simply returning this error result */ chain(_fn) {
        return this;
    }
}
function okResult(v) {
    return new OkResult(v);
}
const VOID_RESULT = okResult(undefined);
function errResult(arg0, ...args) {
    return new ErrResult().addError(arg0, ...args);
}
function error(arg0, ...args) {
    let options = {
        code: DEFAULT_ERR_CODE
    };
    if (typeof arg0 === "string") {
        const msg = arg0;
        if (args.length === 0) return new Err(msg, {
            code: DEFAULT_ERR_CODE
        });
        else if (args.length === 1 && typeof args[0] === "object") return new Err(msg, {
            code: DEFAULT_ERR_CODE,
            ...args[0]
        });
        else if (args.length === 1 && typeof args[0] === "string") return new Err(msg, {
            code: args[0]
        });
        else if (args.length === 2 && typeof args[0] === "string" && typeof args[1] === "string") return new Err(msg, {
            code: args[0],
            widget: args[1]
        });
        else panic(`bad error args`, [
            arg0,
            ...args
        ]);
    } else if (arg0 instanceof Err) return arg0;
    else if (arg0 instanceof Error) return new Err(arg0.message, args.length > 0 ? args[0] : {
        code: DEFAULT_ERR_CODE
    });
    else if (typeof arg0 === "object") return new Err(arg0.toString(), args.length > 0 ? args[0] : {
        code: DEFAULT_ERR_CODE
    });
    else panic(`bad error args`, [
        arg0,
        ...args
    ]);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"aWjit":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "checkField", ()=>checkField);
/** If req is valid as per info, return a success result containing
 *  req with all default values filled in; else returns an error
 *  result.
 */ parcelHelpers.export(exports, "checkFlatReq", ()=>checkFlatReq);
//convenience chk function builders
parcelHelpers.export(exports, "makeRegexChkFn", ()=>makeRegexChkFn);
parcelHelpers.export(exports, "makeOneofChkFn", ()=>makeOneofChkFn);
var _errorsJs = require("./errors.js");
const DEFAULT_ERR_CODE = "BAD_VAL";
function checkField(id, fieldInfos, val) {
    const errs = getFieldErrors(id, fieldInfos, val);
    return errs.length > 0 ? new _errorsJs.ErrResult(errs) : _errorsJs.VOID_RESULT;
}
/** Return errors for val for field id given fieldInfos */ function getFieldErrors(id, fieldInfos, val) {
    const errs = [];
    const fieldInfo = fieldInfos[id];
    if (val === undefined && !("default" in fieldInfo)) {
        const msg = '"$[0]" is required';
        errs.push(makeErr([
            msg,
            "REQUIRED"
        ], fieldInfos, [
            id
        ]));
    } else {
        const val1 = val ?? fieldInfo.default;
        if (fieldInfo.default !== null && val1 !== fieldInfo.default) {
            const chk = fieldInfo.chk ?? [];
            const chkFns = Array.isArray(chk) ? chk : [
                chk
            ];
            for (const chkFn of chkFns){
                const chkVal = chkFn(val1);
                if (chkVal) errs.push(makeErr(chkVal, fieldInfos, [
                    id
                ]));
            }
        }
    }
    return errs;
}
function checkFlatReq(req, checks) {
    const errs = [];
    const fullReq = {
        ...req
    };
    const fieldInfos = checks.fields;
    for (const [id, fieldInfo] of Object.entries(fieldInfos)){
        const val = req[id];
        const fieldErrors = getFieldErrors(id, fieldInfos, val);
        if (fieldErrors.length > 0) errs.push(...fieldErrors);
        else if (fullReq[id] !== undefined) fullReq[id] = val;
        else if (fieldInfo.default !== null) fullReq[id] = fieldInfo.default;
    }
    if (errs.length > 0) return new _errorsJs.ErrResult(errs);
    //all individual field validations pass; check inter-field req validations
    const chk = checks.chk ?? [];
    const reqChkInfos = Array.isArray(chk) ? chk : [
        chk
    ];
    for (const reqChkInfo of reqChkInfos){
        const { chk, fieldIds } = reqChkInfo;
        const chkVal = chk(fullReq);
        if (chkVal) errs.push(makeErr(chkVal, checks.fields, fieldIds));
    }
    return errs.length > 0 ? new _errorsJs.ErrResult(errs) : _errorsJs.okResult(fullReq);
}
function makeRegexChkFn(regex, msg, code = "BAD_VAL") {
    return (val)=>!val.match(regex) && [
            msg,
            code
        ];
}
function makeOneofChkFn(vals, msg, code = "BAD_VAL") {
    return (val)=>!vals.includes(val) && [
            msg,
            code
        ];
}
function makeErr(errRet, info, fieldIds) {
    let [msg, code] = Array.isArray(errRet) ? errRet : [
        errRet,
        DEFAULT_ERR_CODE
    ];
    let err;
    if (fieldIds && fieldIds.length > 0) {
        msg = msg.replace(/\$\[(\d+)\]/g, (_, index)=>{
            const id = fieldIds[Number(index)] ?? "UNKNOWN";
            return info[id]?.name ?? id;
        });
        err = _errorsJs.error(msg, code, fieldIds[0]);
    } else err = _errorsJs.error(msg, code);
    return err;
}

},{"./errors.js":"aGjnO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kUKFB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>init);
var _utilsJs = require("./utils.js");
function init() {
    const app = document.querySelector("#app");
    const tabs = (0, _utilsJs.makeElement)("div", {
        class: "tabs"
    });
    app.append(tabs);
    for (const [rootId, info] of Object.entries(TABS))tabs.append(makeTab(rootId, info));
}
function makeTab(rootId, tabInfo) {
    const section = (0, _utilsJs.makeElement)("section", {
        class: "tab"
    });
    const tabId = `${rootId}-tab`;
    const input = (0, _utilsJs.makeElement)("input", {
        type: "radio",
        name: "tab",
        class: "tab-control",
        id: tabId,
        value: tabId
    });
    section.append(input);
    const h1 = (0, _utilsJs.makeElement)("h1", {
        class: "tab-title"
    });
    section.append(h1);
    const label = (0, _utilsJs.makeElement)("label", {
        for: tabId
    }, tabInfo.label);
    h1.append(label);
    const div = (0, _utilsJs.makeElement)("div", {
        id: `${rootId}-content`,
        class: "tab-content"
    });
    section.append(div);
    const globErrAttrs = {
        id: `${rootId}-errors`,
        class: `${rootId}-errors`
    };
    div.append((0, _utilsJs.makeElement)("ul", globErrAttrs));
    div.append(makeForm(rootId, tabInfo.form));
    const resultsAttrs = {
        id: `${rootId}-results`,
        class: "results"
    };
    if (tabInfo.isFind) {
        const scroll0 = (0, _utilsJs.makeElement)("div", {
            class: "scroll"
        });
        const prevAttrs = {
            class: "hide",
            rel: "prev",
            href: "#"
        };
        const nextAttrs = {
            class: "hide",
            rel: "next",
            href: "#"
        };
        scroll0.append((0, _utilsJs.makeElement)("a", prevAttrs, "<<"));
        scroll0.append((0, _utilsJs.makeElement)("a", nextAttrs, ">>"));
        const ul = (0, _utilsJs.makeElement)("ul", resultsAttrs);
        const scroll1 = (0, _utilsJs.makeElement)("div", {
            class: "scroll"
        });
        scroll1.append((0, _utilsJs.makeElement)("a", prevAttrs, "<<"));
        scroll1.append((0, _utilsJs.makeElement)("a", nextAttrs, ">>"));
        div.append(scroll0, ul, scroll1);
    } else div.append((0, _utilsJs.makeElement)("div", resultsAttrs));
    return section;
}
function makeForm(rootId, formInfo) {
    const form = (0, _utilsJs.makeElement)("form", {
        class: "grid-form",
        id: `${rootId}-form`
    });
    for (const [id, info] of Object.entries(formInfo.fields)){
        const widgetId = `${rootId}-${id}`;
        const label = (0, _utilsJs.makeElement)("label", {
            for: widgetId
        }, info.label);
        form.append(label);
        if (info.required) {
            const required = (0, _utilsJs.makeElement)("span", {
                class: "required",
                title: "Required"
            }, "*");
            label.append(required);
        }
        const span = (0, _utilsJs.makeElement)("span");
        form.append(span);
        const inputAttr = {
            id: widgetId,
            name: id
        };
        if (info.type) inputAttr.type = info.type;
        const input = (0, _utilsJs.makeElement)("input", inputAttr);
        span.append(input);
        span.append((0, _utilsJs.makeElement)("br"));
        const errAttrs = {
            id: `${rootId}-${id}-error`,
            class: `${rootId}-errors error`
        };
        const err = (0, _utilsJs.makeElement)("span", errAttrs);
        span.append(err);
    }
    form.append((0, _utilsJs.makeElement)("span"), (0, _utilsJs.makeElement)("button", {}, formInfo.submit));
    return form;
}
const TABS = {
    addSensorType: {
        label: "Add Sensor Type",
        form: {
            fields: {
                id: {
                    label: "Sensor Type ID",
                    required: true
                },
                manufacturer: {
                    label: "Manufacturer",
                    required: true
                },
                modelNumber: {
                    label: "Model Number",
                    required: true
                },
                quantity: {
                    label: "Quantity",
                    required: true
                },
                unit: {
                    label: "Unit",
                    required: true
                },
                min: {
                    label: "Min Limit",
                    required: true,
                    type: "number"
                },
                max: {
                    label: "Max Limit",
                    required: true,
                    type: "number"
                }
            },
            submit: "Add Sensor Type"
        }
    },
    addSensor: {
        label: "Add Sensor",
        form: {
            fields: {
                id: {
                    label: "Sensor ID",
                    required: true
                },
                sensorTypeId: {
                    label: "Sensor Type ID",
                    required: true
                },
                period: {
                    label: "Period",
                    required: true,
                    type: "number"
                },
                min: {
                    label: "Min Expected",
                    required: true,
                    type: "number"
                },
                max: {
                    label: "Max Expected",
                    required: true,
                    type: "number"
                }
            },
            submit: "Add Sensor"
        }
    },
    findSensorTypes: {
        label: "Find Sensor Types",
        isFind: true,
        form: {
            fields: {
                id: {
                    label: "Sensor Type ID"
                },
                manufacturer: {
                    label: "Manufacturer"
                },
                modelNumber: {
                    label: "Model Number"
                },
                quantity: {
                    label: "Quantity"
                },
                unit: {
                    label: "Unit"
                }
            },
            submit: "Find Sensor Types"
        }
    },
    findSensors: {
        label: "Find Sensor",
        isFind: true,
        form: {
            fields: {
                id: {
                    label: "Sensor ID"
                },
                sensorTypeId: {
                    label: "Sensor Type ID"
                }
            },
            submit: "Find Sensors"
        }
    }
};

},{"./utils.js":"3cCYB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3cCYB":[function(require,module,exports) {
/** Return a new DOM element with specified tagName, attributes
 *  given by object attrs and initial contained text.
 *  Note that .append(TextOrElement...) can be called on the returned
 *  element to append string text or a new DOM element to it.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "makeElement", ()=>makeElement);
/** Return a key-value mapping for all data from form */ parcelHelpers.export(exports, "getFormData", ()=>getFormData);
function makeElement(tagName, attrs = {}, text = "") {
    const element = document.createElement(tagName);
    for (const [k, v] of Object.entries(attrs))element.setAttribute(k, v);
    if (text.length > 0) element.append(text);
    return element;
}
function getFormData(form) {
    const pairs = [
        ...new FormData(form).entries()
    ].map(([k, v])=>[
            k,
            v
        ]).filter(([_, v])=>v.trim().length > 0);
    return Object.fromEntries(pairs);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["dbtGE","CnCET"], "CnCET", "parcelRequireeeb6")

//# sourceMappingURL=index.bf1e63c0.js.map
