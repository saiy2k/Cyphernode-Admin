import { AddressType, AmountType, FeeType } from "./types";

export const baseURL: string = 'https://192.168.1.4:2009/v0';

export const authKeys: string[] = [
  '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwNDA0NTU2NH0.y9q9m7qC_g9W85GFx60FEc86MU1NCqqfEPIEOpGXqYc',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwNDA0NTk1Nn0.LFc-bJCE-Qy3XTQxTugLSyaplpHq8-O4lUvSzn8ushY',
  ''
];

export const FEE_TYPES: FeeType[] = [
    {
        id: 'auto-fastest',
        text: 'Auto (fastest)'
    },
    {
        id: 'auto-1hr',
        text: 'Auto (1 hour)'
    },
    {
        id: 'auto-1d',
        text: 'Auto (1 day)'
    },
    {
        id: 'manual',
        text: 'Auto (fastest)'
    },
];

export const AMOUNT_TYPES: AmountType[] = [
    {
        id: 'btc',
        text: 'BTC'
    },
    {
        id: 'sats',
        text: 'Sats'
    },
    {
        id: 'fiat',
        text: 'FIAT'
    }
];

export const ADDRESS_TYPES: AddressType[] = [
    {
        id: 'legacy',
        text: 'Legacy'
    },
    {
        id: 'bech32',
        text: 'Bech32'
    },
    {
        id: 'p2sh-segwit',
        text: 'P2SH-Segwit'
    },
    {
        id: 'taproot',
        text: 'Taproot'
    },
];

export const dummyTxnDataForSkeleton = [
    {
      address: '',
      category: '',
      amount: 0,
      label: '',
      vout: 0,
      confirmations: 0,
      generated: true,
      blockhash: '',
      blockheight: 0,
      blockindex: 0,
      blocktime: 0,
      txid: '',
      walletconflicts: [],
      time: 0,
      timereceived: 0,
      'bip125-replaceable': '',
      fee: 0,
      abandoned: true,
      trusted: true,
    },
    {
      address: '',
      category: '',
      amount: 0,
      label: '',
      vout: 0,
      confirmations: 0,
      generated: true,
      blockhash: '',
      blockheight: 0,
      blockindex: 0,
      blocktime: 0,
      txid: '',
      walletconflicts: [],
      time: 0,
      timereceived: 0,
      'bip125-replaceable': '',
      fee: 0,
      abandoned: true,
      trusted: true,
    },
    {
      address: '',
      category: '',
      amount: 0,
      label: '',
      vout: 0,
      confirmations: 0,
      generated: true,
      blockhash: '',
      blockheight: 0,
      blockindex: 0,
      blocktime: 0,
      txid: '',
      walletconflicts: [],
      time: 0,
      timereceived: 0,
      'bip125-replaceable': '',
      fee: 0,
      abandoned: true,
      trusted: true,
    }
  ];
