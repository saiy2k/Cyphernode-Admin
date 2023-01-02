export type SuccessResponse = {
  data: any,
  meta: {
    page: number,
    perPage: number,
    pageCount: number,
    totalCount: number,
  }
}

export type ErrorResponse = {
  status: number;
  name: string;
  description: string;
  detail?: any;
}



