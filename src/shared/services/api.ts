import { baseURL } from '../constants';

const authKeys: string[] = [
  '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwMjQ0ODczM30.M-qlE7C00qaQuTqsUXViKZP-u6ypW2uLEJHOapvHPgg',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwMjQ0ODcxNH0.0MG3P1KF5WLao-MRG2h8Ca3gzZFxmD-rk5KjxRudN8Y',
  ''
];

export const getCall = (urlFragment: string, keyIndex: number): Promise<any> => {
  return fetch(`${baseURL}/${urlFragment}`, {
    headers: {
      Authorization: `Bearer ${authKeys[keyIndex]}`
    }
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
