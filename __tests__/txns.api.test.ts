import type { NextApiRequest, NextApiResponse } from 'next'
import {beforeEach, describe, expect, jest, it} from '@jest/globals';
import httpMocks from 'node-mocks-http';
import handler, { parseQueryParams, TxnResponse } from '../pages/api/txns/index';
import { SuccessResponse, ErrorResponse, Txn } from '@shared/types';
import { getCallA } from '@shared/services/api';
import { mockTxns } from './mock-data/txns.json';

jest.mock('@shared/services/api', () => {
  return {
    __esModule: true,
    getCallA: jest.fn(() => Promise.resolve({
      status: 200,
      data: {
        txns: mockTxns.sort((a, b) => b.time - a.time),
      },
    })),
  };
});

describe('Test positive flows', () => {

  beforeEach(() => {
    (Math as any).random = jest.fn().mockReturnValue(0.94);
  });

  it('should return full response', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        perPage: 25,
      }
    });
    const res = httpMocks.createResponse();

    /*
        type: 'generate',
        start: '2022-01-01T00:00:00.000Z',
        end: '2022-01-31T00:00:00.000Z',
        amountMin: 0.1,
        amountMax: 0.5,
        status: 'confirmed',
        sortColumn: 'time',
        sortDirection: 'ASC',
        page: 1
     */

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      data: mockTxns,
      meta: {
        page: 0,
        pageCount: 1,
        perPage: 25,
        totalCount: 3,
      }
    });

  });

});

describe('Test error scenarios', () => {

  it('should return 500 and error JSON data ( SIMULATED Error)', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
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

describe('parseQueryParams', () => {
  it('should return false when type is invalid', () => {

    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        type: 'invalid',
      }
    });
    const res = httpMocks.createResponse();

    const result = parseQueryParams(req, res);
    expect(result).toBe(false);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: 400,
      name: 'Invalid query parameters',
      description: '',
      detail: [{
        instancePath: "/type",
        schemaPath: "#/properties/type/enum",
        keyword: "enum",
        params: {
          allowedValues: ["generate", "immature", "receive", "send"]
        },
        message: "must be equal to one of the allowed values"
      }],
    });
  })

  /*
  it('should return false when status is invalid', () => {

    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        type: 'invalid',
      }
    });
    const res = httpMocks.createResponse();

    req.query.status = 'invalid'
    const result = parseQueryParams(req, res)
    expect(result).toBe(false)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      name: 'Invalid query parameters',
      description: '',
      detail: [{dataPath: '.status', message: 'should be equal to one of the allowed values'}],
    })
  })

  it('should return false when sort column is invalid', () => {
 
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        type: 'invalid',
      }
    });
    const res = httpMocks.createResponse();

    req.query.sortColumn = 'invalid'
    const result = parseQueryParams(req, res)
    expect(result).toBe(false)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      name: 'Invalid query parameters',
      description: '',
      detail: [{dataPath: '.sortColumn', message: 'should be equal to one of the allowed values'}],
    })
  })

  it('should return false when sort direction is invalid', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        type: 'invalid',
      }
    });
    const res = httpMocks.createResponse();

    req.query.sortDirection = 'invalid'
    const result = parseQueryParams(req, res)
    expect(result).toBe(false)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      name: 'Invalid query parameters',
      description: '',
      detail: [{dataPath: '.sortDirection', message: 'should be equal to one of the allowed values'}],
    })
  })
  */

})

