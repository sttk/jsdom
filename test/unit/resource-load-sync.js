"use strict";

const spawnSync = require("child_process").spawnSync;
const syncWorker = require.resolve("../../lib/jsdom/browser/resource-load-sync");
const CookieJar = require("tough-cookie").CookieJar;
const expect = require("chai").expect;
const path = require("path").posix;
const fs = require("fs");

describe("resource-load-sync", () => {
  it("Load a text file synchronously", () => {
    const fp = path.resolve(__dirname, "fixtures/script-load-sync/a.js");
    const url = "file://" + fp;
    const options = {
      cookieJar: new CookieJar(null, { looseMode: true }),
      defaultEncoding: "UTF-8",
    };
    const input = JSON.stringify({ url, options });
    const res = spawnSync(process.execPath, [syncWorker], { input });
    expect(res.status).to.equal(0);
    expect(res.error).to.equal(undefined);
    expect(res.stderr.toString()).to.equal("");

    const output = JSON.parse(res.stdout.toString());
    expect(output.response.headers["content-type"])
      .to.equal("text/plain;charset=UTF-8");
    expect(output.data).to.equal("console.log(\"A\");\n");
  });
  it("Load an image file synchronously", () => {
    const fp = path.resolve(__dirname, "fixtures/script-load-sync/image.png");
    const url = "file://" + fp;
    const options = {
      cookieJar: new CookieJar(null, { looseMode: true }),
    };
    const input = JSON.stringify({ url, options });
    const res = spawnSync(process.execPath, [syncWorker], { input });
    expect(res.status).to.equal(0);
    expect(res.error).to.equal(undefined);
    expect(res.stderr.toString()).to.equal("");
    const output = JSON.parse(res.stdout.toString(), (k, v) => {
      if (v && v.type === "Buffer" && v.data) {
        return new Buffer(v.data);
      }
      return v;
    });
    const contents = Buffer.from(fs.readFileSync(fp));
    expect(output.data).to.deep.equal(contents);
  });
  it("Load a remote text file synchronously", () => {
    const url = "https://raw.githubusercontent.com/sttk/jsdom/master/package.json";
    const options = {
      cookieJar: new CookieJar(null, { looseMode: true }),
      defaultEncoding: "UTF-8",
    };
    const input = JSON.stringify({ url, options });
    const res = spawnSync(process.execPath, [syncWorker], { input });
    expect(res.status).to.equal(0);
    expect(res.error).to.equal(undefined);
    expect(res.stderr.toString()).to.equal("");

    const output = JSON.parse(res.stdout.toString());
    expect(output.response.headers["content-type"])
      .to.equal("text/plain;charset=UTF-8");

    const fp = path.resolve(__dirname, "../../package.json");
    const content = fs.readFileSync(fp, "utf-8");
    expect(output.data).to.equal(content);
  });
});
