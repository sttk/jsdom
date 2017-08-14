"use strict";
const vm = require("vm");
const whatwgEncoding = require("whatwg-encoding");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const reflectURLAttribute = require("../../utils").reflectURLAttribute;
const parseURLToResultingURLRecord = require("../helpers/document-base-url").parseURLToResultingURLRecord;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const nodeTypes = require("../node-type");
const ErrorEvent = require("../generated/ErrorEvent");
const reportException = require("../helpers/runtime-script-errors");
const resourceLoader = require("../../browser/resource-loader");

const jsMIMETypes = new Set([
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript"
]);

class HTMLScriptElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._nonBlocking = true;
  }

  get src() {
    return reflectURLAttribute(this, "src");
  }

  set src(V) {
    this.setAttribute("src", V);
  }

  get async() {
    return Boolean(this._nonBlocking) || (this.getAttribute("async") !== null);
  }

  set async(V) {
    if (V) {
      this.setAttribute("async", "");
    } else {
      this.removeAttribute("async");
    }
  }

  get defer() {
    return this.getAttribute("defer") !== null;
  }

  set defer(V) {
    if (V) {
      this.setAttribute("defer", "");
    } else {
      this.removeAttribute("defer");
    }
  }

  get text() {
    let text = "";
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === nodeTypes.TEXT_NODE) {
        text += child.nodeValue;
      }
    }
    return text;
  }

  set text(text) {
    this.textContent = text;
  }

  setAttribute(name, value) {
    switch (name) {
      case "async": {
        if (!this._attached) {
          delete this._nonBlocking;
        }
        super.setAttribute(name, value);
        break;
      }
      default: {
        super.setAttribute(name, value);
        break;
      }
    }
  }

  _attach() {
    super._attach();
    this._executeScript(this._prepareScript());
  }

  _prepareScript() {
    if (this._alreadyStarted) {
      return { abort: true };
    }

    const srcAttr = this.getAttribute("src");
    if (srcAttr === null && !this.text) {
      return { abort: true };
    }

    if (!this._attached) {
      return { abort: true };
    }

    const jsType = this._getTypeString();
    if (!jsMIMETypes.has(jsType.toLowerCase())) {
      return { abort: true };
    }

    this._alreadyStarted = true;

    const document = this._ownerDocument;
    const window = document._defaultView;

    if (!window || window._runScripts !== "dangerously") {
      return { abort: true };
    }

    const charset = whatwgEncoding.labelToName(this.getAttribute("charset")) ||
                    document._encoding;

    const cors = this._getCorsMode();

    const nonce = this.getAttribute("nonce") || "";

    if (srcAttr !== null) {
      if (srcAttr === "") {
        dispatchErrorEvent(this, document.URL);
        return { abort: true };
      }

      const urlRecord = parseURLToResultingURLRecord(srcAttr, document);
      if (urlRecord === null) {
        dispatchErrorEvent(this, document.URL);
        return { abort: true };
      }
    }

    return { charset, cors, nonce };
  }

  _executeScript({ abort, charset /* , cors, nonce*/ }) {
    if (abort) {
      return;
    }

    const element = this;
    const document = element._ownerDocument;
    const options = { defaultEncoding: charset };

    if (element.src) {
      if (element.defer) {
        const resolve = document._queue.defer(evaluate);
        resourceLoader.loadAsync(element, element.src, options)
          .then(resolve);
        return;
      }

      if (element.async) {
        const resolve = document._queue.async(evaluate);
        resourceLoader.loadAsync(element, element.src, options)
          .then(resolve);
        return;
      }

      resourceLoader.loadSync(element, element.src, options)
        .then(evaluate);
      return;
    }

    try {
      evaluate(element.text);
    } catch (e) {
      resourceLoader.dispatchErrorEvent(element, e, element.src);
    }

    function evaluate(data) {
      element._eval(data, document.URL);
    }
  }

  _modified() {
    super._modified();

    this._executeScript(this._prepareScript());
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);
  }

  _eval(text, filename) {
    this._ownerDocument._writeAfterElement = this;
    processJavaScript(this, text, filename);
    delete this._ownerDocument._writeAfterElement;
  }

  _getTypeString() {
    const typeAttr = this.getAttribute("type");
    const langAttr = this.getAttribute("language");

    if (typeAttr === "") {
      return "text/javascript";
    }

    if (typeAttr === null && langAttr === "") {
      return "text/javascript";
    }

    if (typeAttr === null && langAttr === null) {
      return "text/javascript";
    }

    if (typeAttr !== null) {
      return typeAttr.trim();
    }

    if (langAttr !== null) {
      return "text/" + langAttr;
    }

    return null;
  }

  _getCorsMode() {
    switch (this.getAttribute("crossorigin")) {
      case null: {
        return "omit";
      }
      case "anonymouse": {
        return "same-origin";
      }
      case "use-credentials": {
        return "include";
      }
      default: {
        return "same-origin";
      }
    }
  }
}

function processJavaScript(element, code, filename) {
  const document = element.ownerDocument;
  const window = document && document._global;

  if (window) {
    document._currentScript = element;

    try {
      vm.runInContext(code, window, { filename, displayErrors: false });
    } catch (e) {
      reportException(window, e, filename);
    } finally {
      document._currentScript = null;
    }
  }
}

function dispatchErrorEvent(element, filename) {
  const event = ErrorEvent.createImpl(["error", {
    bubbles: false,
    cancelable: false,
    filename,
    lineno: 1,
    colno: 1
  }]);

  element.dispatchEvent(event);
}

module.exports = {
  implementation: HTMLScriptElementImpl
};
