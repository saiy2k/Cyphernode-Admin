import { NextApiRequest, NextApiResponse } from "next";

import Ajv from "ajv";
import addFormats from 'ajv-formats';

import { getCallA, postCallA } from '@shared/services/api';
import { SuccessResponse, ErrorResponse, WasabiTxn, WasabiGetTransactionsPayload } from 'shared/types';

const QSortColumn = ["date", "amount", "txid"] as const;
const QSortDirection = ["ASC", "DESC"] as const;
const QType = ['in', 'out'] as const;

type QSortColumnEnum = typeof QSortColumn[number];
type QSortDirectionEnum = typeof QSortDirection[number];
type QTypeEnum = typeof QType[number];

export type RequestQuery = {
    instanceId?: number,

    start?: string; // ISO Datetime string; Tested upto seconds precision, but not ms
    end?: string; // ISO Datetime string; Tested upto seconds precision, but not ms

    amountMin?: number;
    amountMax?: number;

    txid?: string;
    type?: QTypeEnum;

    sortColumn?: QSortColumnEnum;
    sortDirection?: QSortDirectionEnum;

    perPage: number;
    page: number;
}
  
export type TxnResponse = SuccessResponse & {
    data: WasabiTxn[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        const validateResponse = parseQueryParams(req, res);
        if (validateResponse === false) {
          return;
        }
    
        const query: RequestQuery = validateResponse as RequestQuery;

        const payload: WasabiGetTransactionsPayload = {};

        if(query.instanceId !== undefined) {
            payload.instanceId = query.instanceId;
        }
 
        const allTxns = await postCallA('wasabi_gettransactions', payload);
    
        let filteredTxns: WasabiTxn[] = [...allTxns.data.transactions];
    
        // ! TODO: Check with timezone
        if (query.start) {
            filteredTxns = filteredTxns.filter(txn => (new Date(txn.datetime).getTime()) >= new Date(query.start as string).getTime());
        }

        // ! TODO: Check with timezone
        if (query.end) {
            filteredTxns = filteredTxns.filter(txn => (new Date(txn.datetime).getTime()) <= new Date(query.end as string).getTime());
        }
    
        if (query.amountMin !== undefined) {
            filteredTxns = filteredTxns.filter(txn => Math.abs(txn.amount) >= query.amountMin!);
        }
    
        if (query.amountMax !== undefined) {
            filteredTxns = filteredTxns.filter(txn => Math.abs(txn.amount) <= query.amountMax!);
        }

        if (query.txid) {
            filteredTxns = filteredTxns.filter(txn => txn.tx.includes(query.txid!));
        }

        if(query.type) {
            if(query.type === 'in') {
                filteredTxns = filteredTxns.filter(txn => txn.amount >= 0);
            } else {
                filteredTxns = filteredTxns.filter(txn => txn.amount < 0);
            }
        }
    
        filteredTxns.sort((a: WasabiTxn, b: WasabiTxn) => {
            if (query.sortColumn === 'amount') {
              return query.sortDirection === 'ASC' ? a.amount - b.amount : b.amount - a.amount;
            } else if (query.sortColumn === 'txid') {
                if(a.tx < b.tx) { return -1; }
                if(a.tx > b.tx) { return 1; }
                return 0;
            } else { // default and 'time'
              return query.sortDirection === 'ASC' ? (new Date(a.datetime).getTime()) - (new Date(b.datetime).getTime()) : (new Date(b.datetime).getTime()) - (new Date(a.datetime).getTime());
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
    } catch(err) {
        const errorResp: ErrorResponse = {
            status: 500,
            name: 'Internal server error',
            description: JSON.stringify(err, Object.getOwnPropertyNames(err))
        }

        res.status(500).json(errorResp);
    }
}

export function parseQueryParams(
    req: NextApiRequest,
    res: NextApiResponse<TxnResponse | ErrorResponse>
): RequestQuery | boolean {
    const query: RequestQuery = { page: 0, perPage: 50 };

    if (req.query.amountMin) query.amountMin = Number(req.query.amountMin);
    if (req.query.amountMax) query.amountMax = Number(req.query.amountMax);

    if (req.query.start) query.start = req.query.start as string;
    if (req.query.end) query.end = req.query.end as string;

    if (req.query.txid) query.txid = req.query.txid as string;
    if (req.query.type) query.type = req.query.type as QTypeEnum;

    if (req.query.sortColumn) query.sortColumn = req.query.sortColumn as QSortColumnEnum;
    if (req.query.sortDirection) query.sortDirection = req.query.sortDirection as QSortDirectionEnum;
  
    if (req.query.perPage) query.perPage = Number(req.query.perPage);
    if (req.query.page) query.page = Number(req.query.page);

    if(req.query.instanceId !== undefined) query.instanceId = Number(req.query.instanceId);
  
    const schema = {
        type: 'object',
        properties: {
          start: { type: 'string', format: "date-time" }, // #TODO: Make sure start < end
          end: { type: 'string', format: "date-time" }, // #TODO: Make sure start < end

          amountMin: { type: 'number' }, // #TODO: amountMin < amountMax
          amountMax: { type: 'number' }, // #TODO: amountMin < amountMax

          txid: { type: 'string' },
    
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