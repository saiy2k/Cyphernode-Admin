import crypto from 'crypto';

export enum API_ID {
  ZERO = "000",
  ONE = "001",
  TWO = "002",
  THREE = "003"
}

const apiIdAndKeyMap = {
  [API_ID.ZERO]: "8f5f06648794d63bb87c6414ba7f4f3f52081868ae7ed456b5b26a59fd16690",
  [API_ID.ONE]: "fac36d600797323d6f0fd458f789b9aaf2ff8b41349a606cadcb71cd9ff619b7",
  [API_ID.TWO]: "86be503cf5cf8d187b16431662318867164f3c0dac90d43272d1f70013896a8b",
  [API_ID.THREE]: "74712e04904520cbdb72fdbe22912b261ab47181897b6a2347caa0550e9bbe9e",
};

const urlAndApiId: any = {
  get_txns_spending: API_ID.TWO,
  getblockchaininfo: API_ID.ONE,
  getbalance: API_ID.TWO,
  getnewaddress: API_ID.TWO,
  spend: API_ID.TWO,

  getactivewatches: API_ID.ONE,
  getactivexpubwatches: API_ID.ONE,
  watch: API_ID.ONE,
  watchxpub: API_ID.TWO,
  unwatch: API_ID.ONE,
  unwatchxpubbyxpub: API_ID.ONE,

  listbatchers: API_ID.TWO,
  createbatcher: API_ID.TWO,
  updatebatcher: API_ID.TWO,
  getbatchdetails: API_ID.TWO,
  addtobatch: API_ID.TWO,
  removefrombatch: API_ID.TWO,
  batchspend: API_ID.TWO,

  ots_stamp: API_ID.THREE,
  ots_info: API_ID.THREE,
};

export function generateKey(url: string) {
  const h64 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9Cg==";

  let apiKey = "";

  const apiId: API_ID = urlAndApiId[url];

  if(apiId !== undefined) {
    apiKey = apiIdAndKeyMap[apiId];
  } else {
    // Other urls not mapped here fallbacks to 002 auth key
    apiKey = apiIdAndKeyMap[API_ID.TWO];
  }

  const current = Math.round((new Date().getTime())/1000) + 10;
  const p = `{"id": "${apiId}","exp":${current}}`;
  const p64 = Buffer.from(p).toString("base64");
  const msg = `${h64}.${p64}`;
  const s = crypto.createHmac("sha256", apiKey)
    .update(msg)
    .digest("hex");
  return `${msg}.${s}`;
}
