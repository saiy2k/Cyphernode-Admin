import { AddressType, AmountType, FeeType } from "./types";

export const baseURL: string = 'https://192.168.1.5:2009/v0';

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
