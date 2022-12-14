export interface NavItem {
  id: string;
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const NAV_ITEMS: Array<NavItem> = [

  {
    id: 'm0',
    label: 'Dashboard',
    href: '/',
  },

  {
    id: 'm1',
    label: 'Bitcoin',
    href: 'bitcoin',
    children: [
      {
        id: 'm1s1',
        label: 'Watches',
        href: 'bitcoin/watches',
      },
      {
        id: 'm1s2',
        label: 'Batches',
        href: 'bitcoin/batches',
      },
    ],
  },

  {
    id: 'm2',
    label: 'Lightning',
    href: 'lightning',
  },

  {
    id: 'm3',
    label: 'Wasabi',
    href: 'wasabi',
  },

  {
    id: 'm4',
    label: 'Liquid',
    href: 'liquid',
    children: [
      {
        id: 'm4s1',
        label: 'Watches',
        href: 'liquid/watches',
      },
    ]
  },

  {
    id: 'm5',
    label: 'OTS',
    href: 'ots',
  },

  {
    id: 'm6',
    label: 'Settings',
    href: 'settings',
    children: [
      {
        id: 'm4s1',
        label: 'Cyphernode keys',
        href: 'settings/cyphernode-keys',
      },
    ]
  },


];


export const USER_NAV_ITEMS: Array<NavItem> = [
  {
    id: 'a10',
    label: 'Settings',
  },
  {
    id: 'a11',
    label: 'Signout',
  },
]
