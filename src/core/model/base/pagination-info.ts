export class PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    firstPage: number;
    lastPage: number;
    nextTwoPages: number[];
    previousTwoPages: number[];
}
