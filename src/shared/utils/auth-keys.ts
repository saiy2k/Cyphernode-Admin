import crypto from 'crypto';

export enum API_ID {
  ZERO = "000",
  ONE = "001",
  TWO = "002",
  THREE = "003"
}

const apiIdAndKeyMap = {
  [API_ID.ZERO]: "5b749a7f05309089519f289f16cbc22ae62e3f7f942509317380a336ead55271",
  [API_ID.ONE]: "17635a64ed4a82a1d69da9374d3b3b1886e976744187603c9d07c770d9307044",
  [API_ID.TWO]: "51a63a736a75b70eb279c8633c33d520de87ce81f2140f837ebddae53acb8065",
  [API_ID.THREE]: "4991548e221f7512922df3f63d3ed9857e4e838112de3fe0a66d00c3d06ec519",
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
