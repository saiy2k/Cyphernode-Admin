import {beforeEach, describe, expect, jest, test} from '@jest/globals';
const httpMocks = require('node-mocks-http');
const handler = require('../pages/api/txns/index').default;
import { baseURL as cnUrl } from '@shared/constants';


const mockTxns = [
  {
    category: 'generate',
    time: 1609459200,
    amount: 0.1,
    confirmations: 12
  },
  {
    category: 'generate',
    time: 1609459201,
    amount: 0.2,
    confirmations: 12
  },
  {
    category: 'generate',
    time: 1609459202,
    amount: 0.3,
    confirmations: 12
  }
];


import { getCallA } from '@shared/services/api';
jest.mock('@shared/services/api', () => {
  // const originalModule: any = jest.requireActual('@shared/services/api');
  return {
    __esModule: true,
    // ...originalModule,
    getCallA: jest.fn(() => Promise.resolve({
      status: 200,
      data: {
        txns: mockTxns,
        meta: {
          page: 1,
          pageCount: 0,
          perPage: 25,
          totalCount: 0,
        }
      }
    })),
  };
});

describe('API route handler', () => {

  beforeEach(() => {
    (Math as any).random = jest.fn().mockReturnValue(0.94);
  });

  test('should return 200 and expected JSON data', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/path',
      query: {
        type: 'generate',
        start: '2022-01-01T00:00:00.000Z',
        end: '2022-01-31T00:00:00.000Z',
        amountMin: 0.1,
        amountMax: 0.5,
        status: 'confirmed',
        sortColumn: 'time',
        sortDirection: 'ASC',
        perPage: 25,
        page: 1
      }
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      status: 200,
      data: mockTxns
    });
  });

  test('should return 500 and error JSON data', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/path'
    });
    const res = httpMocks.createResponse();
    (Math as any).random = jest.fn().mockReturnValue(0.96);

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      status: 500,
      name: 'Internal server error',
      description: '[SIMULATED] A random API error',
      detail: {
        errorType: 'Alien',
        galaxy: 'Andromeda',
        system: 'sol-02'
      }
    });
  });
});
