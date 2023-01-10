import crypto from 'crypto';

export enum API_ID {
  ZERO = "000",
  ONE = "001",
  TWO = "002",
  THREE = "003"
}

const apiIdAndKeyMap = {
  [API_ID.ZERO]: "dcaf71599ba8472ffa5c184df6179804e4d7c72aacfa2b7919c8e1456c1c19a6",
  [API_ID.ONE]: "34825918ea86edd1f17f4ac5175d026744ace02d55752890b7ff3f4ba2e0fb1b",
  [API_ID.TWO]: "b5d1fa4eb323e9300132f4d699dd73fce9979c63d8d5bcad0fad1af72ecdbe22",
  [API_ID.THREE]: "09ae6111d139bc09516a16bffb86f8061490f03c2e1997f97261327d9038ed95",
};

const urlAndApiId: any = {
  get_txns_spending: API_ID.TWO,
  getblockchaininfo: API_ID.ONE,
  getbalance: API_ID.TWO,
  getnewaddress: API_ID.TWO,
  spend: API_ID.TWO,
  getactivewatches: API_ID.ONE,
  watch: API_ID.TWO,
  watchxpub: API_ID.TWO,
};

export function generateKey(url: string) {
  const h64 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9Cg==";

  let apiKey = "";

  const apiId: API_ID = urlAndApiId[url];

  if(apiId !== undefined) {
    apiKey = apiIdAndKeyMap[apiId];
  } else {
    // Other urls not mapped here fallbacks to 002 auth key
    apiKey = apiIdAndKeyMap[API_ID.ONE];
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
