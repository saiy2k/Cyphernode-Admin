// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { baseURL as cnUrl } from '@shared/constants';

const authKeys: string[] = [
  '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwMzYwOTQ1M30.EvzflCGcNTxJkU6XkdJNaINFJBjzB4Zv78KG98pfF6w',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwMzYwOTQ1N30.zkrjWm_VfbGcK0ftIu8lD0mQSrhiZQnxxaJphnr4GEM',
  ''
];

type Data = {
  name: string,
  url: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe', url: cnUrl })
}
