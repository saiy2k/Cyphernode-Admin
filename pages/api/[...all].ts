import httpProxy from 'http-proxy';
import { generateKey } from '@shared/utils/auth-keys';
import { baseURL } from 'shared/constants';

// const options = {
//     target : "https://127.0.0.1:2009",
//     secure : false,
//     preserveHeaderKeyCase: true
// }

// const CN_URL = 'https://192.168.1.4:2009/v0';
const handler = (req: any, res: any) => {
  return new Promise((resolve, reject) => {
    const proxy: httpProxy = httpProxy.createProxy();

    if(req.url.includes("/api")) {
      req.url = req.url.replace("/api", "");
    }

    const topUrlSegment = req.url.split("/")[1];

    proxy
      .once("proxyRes", resolve).once("error", reject).web(req, res, {
        // changeOrigin: true,
        target: baseURL,
        secure: false,
        preserveHeaderKeyCase: true,
        headers: {
          Authorization: `Bearer ${generateKey(topUrlSegment)}`
        }
      });
  });
}

// httpProxy.createProxyServer(options).listen(8000);

export default handler;
