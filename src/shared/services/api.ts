import { generateKey } from '@shared/utils/auth-keys';
import axios, {isCancel, AxiosError} from 'axios';
import https from 'https';
import { baseURL } from '../constants';

export const getCallA = (urlFragment: string): Promise<any> => {

  const topUrlSegment = urlFragment.split("/")[0];

  return axios.get(urlFragment, {
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${generateKey(topUrlSegment)}`,
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  });
}

export const getCallProxy = (urlFragment: string, query: any = {}): Promise<any> => {
  const queryString = new URLSearchParams(query);

  let url = `/api/${urlFragment}`;

  if(Object.keys(query).length > 0) {
    url += `?${queryString.toString()}`;
  }

  // console.log('getCallProxy: ', url);

  return fetch(url);
}

export const postCallProxy = (urlFragment: string, payload: any): Promise<any> => {

  let url = `/api/${urlFragment}`

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
