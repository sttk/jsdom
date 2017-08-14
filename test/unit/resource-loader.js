"use strict";

const resourceLoader = require("../../lib/jsdom/browser/resource-loader");
const expect = require("chai").expect;
const path = require("path").posix;
const { VirtualConsole, JSDOM } = require("../..");

describe("resource-loader", () => {
  it("Parse script element without `runScripts` option", () => {
    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const window = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
<script src="${url}"></script>
</head>
<body>
</body>
</html>
`).window;
  });
  it("Parse script element without `resources` option", () => {
    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const window = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
<script src="${url}"></script>
</head>
<body>
</body>
</html>
`, { runScripts: "dangerously" }).window;
  });
  it("Load a text file synchronously", done => {
    const logs = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("log", text => {
      logs.push(text);
    });
    const runScripts = "dangerously";
    const resources = "usable";

    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const window = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
<script src="${url}"></script>
</head>
<body>
</body>
</html>
`, { runScripts, resources, virtualConsole }).window;

    window.addEventListener("load", () => {
      try {
        expect(logs).to.deep.equal(["A"]);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  it("Load a text file asynchronously", done => {
    const logs = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("log", text => {
      logs.push(text);
    });
    const runScripts = "dangerously";
    const resources = "usable";

    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const window = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
<script src="${url}" async></script>
</head>
<body>
</body>
</html>
`, { runScripts, resources, virtualConsole }).window;

    window.addEventListener("load", () => {
      try {
        expect(logs).to.deep.equal(["A"]);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  it("Load a text file with defer", done => {
    const logs = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("log", text => {
      logs.push(text);
    });
    const runScripts = "dangerously";
    const resources = "usable";

    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const window = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
<script src="${url}" defer></script>
</head>
<body>
</body>
</html>
`, { runScripts, resources, virtualConsole }).window;

    window.addEventListener("load", () => {
      try {
        expect(logs).to.deep.equal(["A"]);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
