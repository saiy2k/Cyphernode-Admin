import crypto from 'crypto';

export enum API_ID {
  ZERO = "000",
  ONE = "001",
  TWO = "002",
  THREE = "003"
}

const apiIdAndKeyMap = {
  [API_ID.ZERO]: "ce394562a83489f8a5c661c9f96049ecfb48604d921ec2347b687632e57ca52d",
  [API_ID.ONE]: "52f73fbae602ba60c6a7337048868d28bb551b1276f4bd93eca2922bc34834c7",
  [API_ID.TWO]: "4de4d12600d5ebb221b7ad4687f1af06ef25a5ae0c1501ef31dd7801160b6e3b",
  [API_ID.THREE]: "8dc5d1dacd731be6c43844346da49aec1bfce6a8148bb094e4c77d7caff8ae2c",
};

const urlAndApiId: any = {
  get_txns_spending: API_ID.TWO,
  getblockchaininfo: API_ID.ONE,
  getbalance: API_ID.TWO,
  getnewaddress: API_ID.TWO,
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
