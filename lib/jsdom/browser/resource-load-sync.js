"use strict";

const resourceLoader = require("./resource-loader");
const CookieJar = require("tough-cookie").CookieJar;
const util = require("util");
const URL = require("url");

const chunks = [];

process.stdin.on("data", chunk => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  const buffer = Buffer.concat(chunks);
  const input = JSON.parse(buffer.toString(), (k, v) => {
    if (v && v.type === "Buffer" && v.data) {
      return new Buffer(v.data);
    }
    if (k === "cookieJar" && v) {
      return CookieJar.fromJSON(v);
    }
    return v;
  });

  const urlObj = URL.parse(input.url);
  try {
    if (urlObj.hostname) {
      resourceLoader.download(input.url, input.options, output);
    } else {
      const filePath = resourceLoader.urlToPath(urlObj.pathname);
      resourceLoader.readFile(filePath, input.options, output);
    }
  } catch (e) {
    output(e, null);
  }
});

function output(err, data, response) {
  const out = {};
  if (err) {
    out.error = err.stack || util.inspect(err);
  }
  out.data = data;
  out.response = response;

  process.stdout.write(JSON.stringify(out), () => {
    /* eslint no-process-exit: "off" */
    process.exit(0);
  });
}

