import {PaginationInfo} from "./pagination-info";
import {FlattenField} from "./flatten-field ";
import {ComputedField} from "./computed-field ";

export class GetRows<DTO,ENTITY> {
    page: number;
    filter: DTO;
    sort: Record<string, "ASC" | "DESC">;
    pageSize?: number;
    flattenView?: FlattenField[];
    data:ENTITY;
    total:number;
    pagination?: PaginationInfo;
    computed:ComputedField[]
}
