#!/usr/bin/env node

"use strict";

const fs = require("fs").promises;
const lib = require("./lib");

main();

async function main() {
  const breaches = await lib.getBreaches();
  const linkMap = new Map();
  for (const breach of breaches) {
    try {
      await lib.linkCheck(breach.DomainHref);
    } catch (err) {
      const res = err.data;
      const arr = linkMap.get(res.status) || [];
      res.name = breach.Name;
      arr.push(res);
      linkMap.set(res.status, arr);
      await fs.writeFile("./results.json", mapToString(linkMap));
    }
  }
}

function mapToString(value) {
  return JSON.stringify(Object.fromEntries(value), null, 2);
}
