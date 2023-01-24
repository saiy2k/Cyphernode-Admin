import type { NextApiRequest, NextApiResponse } from 'next'
import Ajv from "ajv";
import addFormats from 'ajv-formats';

import { getCallA } from '@shared/services/api';
import { SuccessResponse, ErrorResponse, Txn } from 'shared/types';

const QTypes = ["generate", "immature", "receive", "send"] as const;
const QStatus = ["pending", "confirmed"] as const;
const QSortColumn = ["type", "time", "amount", "confirmations"] as const;
const QSortDirection = ["ASC", "DESC"] as const;

type QTypeEnum = typeof QTypes[number];
type QStatusEnum = typeof QStatus[number];
type QSortColumnEnum = typeof QSortColumn[number];
type QSortDirectionEnum = typeof QSortDirection[number];

export type RequestQuery = {
  type?: QTypeEnum;
  start?: string; // ISO Datetime string; Tested upto seconds precision, but not ms
  end?: string; // ISO Datetime string; Tested upto seconds precision, but not ms
  amountMin?: number;
  amountMax?: number;
  status?: QStatusEnum;

  sortColumn?: QSortColumnEnum;
  sortDirection?: QSortDirectionEnum;

  perPage: number;
  page: number;
}

export type TxnResponse = SuccessResponse & {
  data: Txn[]
}

/**
 * TODO: Logging
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TxnResponse | ErrorResponse>
) {

  try {

    /*
    if (Math.random() > 0.95) {
      const errorResp: ErrorResponse = {
        status: 500,
        name: 'Internal server error',
        description: '[SIMULATED] A random API error',
        detail: {
          errorType: 'Alien',
          galaxy: 'Andromeda',
          system: 'sol-02'
        }
      }
      res.status(500).json(errorResp);
      return;
    }
    */

    const validateResponse = parseQueryParams(req, res);
    if (validateResponse === false) {
      return;
    }
    const query: RequestQuery = validateResponse as RequestQuery;
    // console.log('request query', query);

    const allTxns = await getCallA('get_txns_spending/1000');
    // console.log(allTxns.data.txns.length);
    let filteredTxns: Txn[] = [...allTxns.data.txns];

    // TODO: Combine these into single filter()
    if (query.type) {
      filteredTxns = filteredTxns.filter(txn => query.type!.includes(txn.category));
    }

    if (query.start) {
      filteredTxns = filteredTxns.filter(txn => txn.time * 1000 >= new Date(query.start as string).getTime());
    }

    if (query.end) {
      filteredTxns = filteredTxns.filter(txn => txn.time * 1000 <= new Date(query.end as string).getTime());
    }

    if (query.amountMin !== undefined) {
      filteredTxns = filteredTxns.filter(txn => txn.amount >= query.amountMin!);
    }

    if (query.amountMax !== undefined) {
      filteredTxns = filteredTxns.filter(txn => txn.amount <= query.amountMax!);
    }

    if (query.status) {
      filteredTxns = filteredTxns.filter(txn => (query.status === 'pending' && txn.confirmations === 0) || (query.status === 'confirmed' && txn.confirmations !== 0));
    }

    filteredTxns.sort((a: Txn, b: Txn) => {
      if (query.sortColumn === 'type') {
        return query.sortDirection === 'ASC' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
      } else if (query.sortColumn === 'amount') {
        return query.sortDirection === 'ASC' ? a.amount - b.amount : b.amount - a.amount;
      } else if (query.sortColumn === 'confirmations') {
        return query.sortDirection === 'ASC' ? a.confirmations - b.confirmations : b.confirmations - a.confirmations;
      } else { // default and 'time'
        return query.sortDirection === 'ASC' ? a.time - b.time : b.time - a.time;
      }
    });

    const paginatedTxns = filteredTxns.slice(
      query.page * query.perPage,
      (query.page + 1) * query.perPage
    );
    const resp: TxnResponse = {
      data: paginatedTxns,
      meta: {
        page: query.page,
        perPage: query.perPage,
        pageCount: Math.ceil(filteredTxns.length / query.perPage),
        totalCount: filteredTxns.length
      }
    };
    res.status(200).json(resp);

  } catch (err) {
    console.error(err);
    const errorResp: ErrorResponse = {
      status: 500,
      name: 'Internal server error',
      description: JSON.stringify(err, Object.getOwnPropertyNames(err))
    }
    res.status(500).json(errorResp);
  }

}

/*
 * TODO: On duplicate query params, error message is misleading.
 * TODO: Simplify ajv error messages in general
 */
export function parseQueryParams(
  req: NextApiRequest,
  res: NextApiResponse<TxnResponse | ErrorResponse>
): RequestQuery | boolean {

  const query: RequestQuery = { page: 0, perPage: 50 };

  if (req.query.amountMin) query.amountMin = Number(req.query.amountMin);
  if (req.query.amountMax) query.amountMax = Number(req.query.amountMax);
  if (req.query.start) query.start = req.query.start as string;
  if (req.query.end) query.end = req.query.end as string;
  if (req.query.type) query.type = req.query.type as QTypeEnum;
  if (req.query.status) query.status = req.query.status as QStatusEnum;

  if (req.query.sortColumn) query.sortColumn = req.query.sortColumn as QSortColumnEnum;
  if (req.query.sortDirection) query.sortDirection = req.query.sortDirection as QSortDirectionEnum;

  if (req.query.perPage) query.perPage = Number(req.query.perPage);
  if (req.query.page) query.page = Number(req.query.page);

  const schema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: QTypes },
      start: { type: 'string', format: "date-time" }, // #TODO: Make sure start < end
      end: { type: 'string', format: "date-time" }, // #TODO: Make sure start < end
      amountMin: { type: 'number' }, // #TODO: amountMin < amountMax
      amountMax: { type: 'number' }, // #TODO: amountMin < amountMax
      status: { type: 'string', enum: QStatus },

      sortColumn: { type: 'string', enum: QSortColumn },
      sortDirection: { type: 'string', enum: QSortDirection },
      
      perPage: { type: 'number', enum: [10, 25, 50, 100] },
      page: { type: 'number' },
    },
  }

  const ajv = new Ajv({allErrors: true, $data: true});
  addFormats(ajv);

  const valid = ajv.validate(schema, query);
  if(!valid) {
    console.error(ajv.errors);
    const errorResp: ErrorResponse = {
      status: 400,
      name: 'Invalid query parameters',
      description: '',
      detail: ajv.errors
    }
    res.status(errorResp.status).json(errorResp);
    return false;
  }

  return query;

}
