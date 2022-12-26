import axios, {isCancel, AxiosError} from 'axios';
import https from 'https';
import { baseURL } from '../constants';

const authKeys: string[] = [
  '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwMzYwOTQ1M30.EvzflCGcNTxJkU6XkdJNaINFJBjzB4Zv78KG98pfF6w',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwMzYwOTQ1N30.zkrjWm_VfbGcK0ftIu8lD0mQSrhiZQnxxaJphnr4GEM',
  ''
];

/*
export const getCall = (urlFragment: string, keyIndex: number): Promise<any> => {
  return axios.get(urlFragment, {
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${authKeys[keyIndex]}`,
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  });
}
*/

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
