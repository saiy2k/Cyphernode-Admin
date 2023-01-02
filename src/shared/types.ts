import { ReactNode } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { ButtonGroupOptions } from "./components";

export type Txn = {
  address: string;
  category: string;
  amount: number;
  label: string;
  vout: number;
  confirmations: number;
  generated?: boolean;
  blockhash?: string;
  blockheight?: number;
  blockindex?: number;
  blocktime?: number;
  txid: string;
  walletconflicts: any[];
  time: number;
  timereceived: number;
  'bip125-replaceable': string;
  fee?: number;
  abandoned?: boolean;
  trusted?: boolean;
}

export type BlockInfo = {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  time: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  warnings: string;
}

export interface FeeType extends ButtonGroupOptions { };

export interface AmountType extends ButtonGroupOptions { };

export interface AddressType  extends ButtonGroupOptions { };

export type CustomColumnDef<T> = ColumnDef<T> & { fieldType?: string, options?: any[] }

export type DetailCell = {
  title: string,
  value: ReactNode
}

export type DetailRow = {
  key: number;
  left: DetailCell;
  right: DetailCell;
};

export { type SuccessResponse, type ErrorResponse } from './api.types';
export type SpendCoinPayload = {
  address: string,
  amount: number,
};
