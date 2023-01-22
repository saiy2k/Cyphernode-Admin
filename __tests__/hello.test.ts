import {describe, expect, test} from '@jest/globals';
const httpMocks = require('node-mocks-http');
const handler = require('../pages/api/hello').default;
import { baseURL as cnUrl } from '@shared/constants';

describe('API route handler', () => {
  test('should return 200 and expected JSON data', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/path'
    });
    const res = httpMocks.createResponse();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ name: 'John Doe', url: cnUrl });
  });
});
