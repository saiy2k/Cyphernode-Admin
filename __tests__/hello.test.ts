import {describe, expect, test} from '@jest/globals';
import httpMocks from 'node-mocks-http';
import handler from '../pages/api/hello';
import { baseURL as cnUrl } from '@shared/constants';

describe('API route handler', () => {
  test('should return 200 and expected JSON data', () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ name: 'John Doe', url: cnUrl });
  });
});
