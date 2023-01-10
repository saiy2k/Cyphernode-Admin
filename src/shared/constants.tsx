import { AddressType, AmountType, ConfTarget } from "./types";

export const baseURL: string = 'https://192.168.1.4:2009/v0';


export const CONF_TARGET: ConfTarget[] = [
    {
        id: '1',
        text: '1b/10 mins'
    },
    {
        id: '3',
        text: '3b/30 mins'
    },
    {
        id: '6',
        text: '6b/1 hour'
    },
    {
        id: '144',
        text: '144b/1 day'
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

export const dummyTxnDataForSkeleton = new Array(10).fill({
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
});

export const dummyWatchDataForSkeleton = new Array(10).fill({
  id: 0,
  address: '',
  imported: false,
  unconfirmedCallbackURL: '',
  confirmedCallbackURL: '',
  label: '',
  watching_since: '',
});
