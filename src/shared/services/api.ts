import axios, {isCancel, AxiosError} from 'axios';
import https from 'https';
import { baseURL } from '../constants';

const authKeys: string[] = [
  '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwNDA0NTU2NH0.y9q9m7qC_g9W85GFx60FEc86MU1NCqqfEPIEOpGXqYc',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwNDA0NTk1Nn0.LFc-bJCE-Qy3XTQxTugLSyaplpHq8-O4lUvSzn8ushY',
  ''
];

export const getCallA = (urlFragment: string, keyIndex: number): Promise<any> => {
  return axios.get(urlFragment, {
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${authKeys[keyIndex]}`,
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  });
}

export const getCall = (urlFragment: string, keyIndex: number): Promise<any> => {
  return fetch(`${baseURL}/${urlFragment}`, {
    headers: {
      Authorization: `Bearer ${authKeys[keyIndex]}`,
    },
  });
}

export const postCall = (urlFragment: string, keyIndex: number, payload: any): Promise<any> => {
  return fetch(`${baseURL}/${urlFragment}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${authKeys[keyIndex]}`
    }
  });
}

export const getCallProxy = (urlFragment: string, query: any={}): Promise<any> => {
  const queryString = new URLSearchParams(query);
  return fetch(`api/${urlFragment}?${queryString}`);
}
