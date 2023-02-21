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

export type Watch = {
  id: number;
  address: string;
  imported: boolean;
  unconfirmedCallbackURL: string;
  confirmedCallbackURL: string;
  label: string;
  watching_since: string;
  pub32?: string;
  derivation_path?: string;
  last_imported_n?: number;
};

export type Batch = {
  batcherId: number;
  batcherLabel: string;
  confTarget: number;
  nbOutputs: number;
  oldest: string;
  total: number;
  txid?: string;
  hash?: string;
  outputs?: BatchTxn[];
};


export type BatchTxn = {
  outputId: number;
  outputLabel: string;
  address: string;
  amount: number;
  addedTimestamp: string;
};

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

export interface ConfTarget extends ButtonGroupOptions { };

export interface AmountType extends ButtonGroupOptions { };

export interface AddressType  extends ButtonGroupOptions { };

export type FilterType = {
  id: any,
  text: string,
}

export type ClientCustomColumnDef<T> = ColumnDef<T> & {
  fieldType: ("text" | "number" | "select" | "date"),
  options?: FilterType[],
  width: string,
}

export type CustomColumnDef<T> = ColumnDef<T> & { fieldType?: string, options?: any[], width: string }

export type DetailCell = {
  title: string,
  value: ReactNode
}

export type DetailRow = {
  key: number;
  left?: DetailCell;
  right?: DetailCell;
};

export { type SuccessResponse, type ErrorResponse } from './api.types';
export type SpendCoinPayload = {
  address: string,
  amount: number,
  confTarget: number
};

type WatchPayload = {
  label?: string,
  confirmedCallbackURL: string,
  unconfirmedCallbackURL: string,
}

export type WatchAddressPayload = {
  address: string,
} & WatchPayload;

export type WatchXPubPayload = {
  pub32: string,
  path?: string,
  nStart?: number,
} & WatchPayload;

export type AddToBatchPayload = {
  address: string,
  amount: number,
  batcherId: number,
  webhookUrl: string,
};

export type OTS_StampPayload = {
  hash: string,
  callbackURL: string,
};

export type OTS_GetInfoPayload = {
  hash: string,
}

export type Wasabi = {
  type: ("IN" | "OUT"),
  date: string,
  sats: number,
  fee: number,
  txnId: string,
  status: ("pending" | "confirmed"),
  inputAddress: string,
  outputAddress: string,
  confirmations: number,
  confirmedBlock: number,
}

export type WasabiSendPayload = {
  instanceId: number,
  private: boolean,
  amount: number,
  address: string,
  label: string,
  minanonset: number,
};

export type WasabiInstance = ("ALL" | "0" | "1");

export type WasabiGetAddressPayload = {
  instanceId: number,
  label: string,
};

export type WasabiInstanceBalance = {
  rcvd0conf: number;
  mixing: number;
  private: number;
  total: number;
};

export type WasabiGetBalancesSuccessResponse = {
  0: WasabiInstanceBalance,
  1: WasabiInstanceBalance,
  "all": WasabiInstanceBalance,
}

export type WasabiTxn = {
  datetime: string,
  height: number,
  amount: number,
  label: string[],
  tx: string,
  islikelycoinjoin: boolean,
};

export type WasabiGetTransactionsPayload = {
  instanceId?: number,
}