const { promisify } = require("util");

const HIBP = require("hibp-chain-api");
const _linkCheck = promisify(require("link-check"));

module.exports = {
  getBreaches,
  linkCheck
};

async function getBreaches(limit = 0) {
  const breaches = await new HIBP().getBreaches();
  return breaches
    .hasDomain()
    .sort("-BreachDate")
    .breaches(limit)
    .map(breach => {
      breach.DomainHref = `https://www.${breach.Domain}`;
      return breach;
    });
}

async function linkCheck(href, opts = {}) {
  opts = Object.assign(
    { timeout: "2s", aliveStatusCodes: [/^[23][0-9]{2}$/] },
    opts
  );
  const res = await _linkCheck(href, opts);
  if (!res.err) delete res.err;
  if (res.err && res.err.rawPacket) delete res.err.rawPacket;
  if (res.status !== "alive") {
    const err = new Error(`Unable to connect to "${href}" [${res.statusCode}]`);
    err.data = res;
    throw err;
  }
  return res;
}
