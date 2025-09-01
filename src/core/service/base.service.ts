import {Repository, SelectQueryBuilder} from "typeorm";
import {GetRows} from "../model/base/get-rows";
import {ActionResult} from "../model/base/action-result";
import {MessageConst} from "../const/message.const";
import {EN_Status} from "../enum/base/EN_Status";
import {HelperService} from "./helper.service";


export class BaseService<Entity> {
    constructor(
        protected readonly repository: Repository<Entity>,
        protected readonly helperService: HelperService,
    ) {
    }

    async getRows<Dto>(
        getRows: GetRows<Dto, Entity[]>,
        modifyQuery?: (query: SelectQueryBuilder<Entity>, alias: string) => void,
        alias: string = 'entity'
    ): Promise<GetRows<Dto, Entity[]>> {
        const query = this.repository.createQueryBuilder(alias);
        const pageSize = getRows.pageSize || 10;
        const page = Math.max(getRows.page || 1, 1);

        // ------------------ فیلترها ------------------
        if (getRows.filter) {
            Object.entries(getRows.filter).forEach(([field, condition]: [string, any]) => {
                const [fieldAlias, fieldName] = field.includes('.') ? field.split('.') : [alias, field];
                const column = `${fieldAlias}.${fieldName}`;
                const parameterKey = `${fieldAlias}_${fieldName}`.replace(/[^a-zA-Z0-9_]/g, '_');

                if (typeof condition === 'object' && condition.filter !== undefined) {
                    const operator = condition.type || 'contains';
                    const filterValue = condition.filter;

                    switch (operator) {
                        case 'contains':
                            query.andWhere(`LOWER(${column}) LIKE LOWER(:${parameterKey})`, {
                                [parameterKey]: `%${filterValue}%`,
                            });
                            break;
                        case 'notContains':
                            query.andWhere(`LOWER(${column}) NOT LIKE LOWER(:${parameterKey})`, {
                                [parameterKey]: `%${filterValue}%`,
                            });
                            break;
                        case 'equals':
                            query.andWhere(`${column} = :${parameterKey}`, { [parameterKey]: filterValue });
                            break;
                        case 'notEqual':
                            query.andWhere(`${column} != :${parameterKey}`, { [parameterKey]: filterValue });
                            break;
                        case 'startsWith':
                            query.andWhere(`LOWER(${column}) LIKE LOWER(:${parameterKey})`, {
                                [parameterKey]: `${filterValue}%`,
                            });
                            break;
                        case 'endsWith':
                            query.andWhere(`LOWER(${column}) LIKE LOWER(:${parameterKey})`, {
                                [parameterKey]: `%${filterValue}`,
                            });
                            break;
                        case 'greaterThan':
                            query.andWhere(`${column} > :${parameterKey}`, { [parameterKey]: filterValue });
                            break;
                        case 'lessThan':
                            query.andWhere(`${column} < :${parameterKey}`, { [parameterKey]: filterValue });
                            break;
                        case 'inRange':
                            query.andWhere(`${column} BETWEEN :${parameterKey}_from AND :${parameterKey}_to`, {
                                [`${parameterKey}_from`]: condition.filter,
                                [`${parameterKey}_to`]: condition.filterTo,
                            });
                            break;
                    }
                } else {
                    query.andWhere(`LOWER(${column}) LIKE LOWER(:${parameterKey})`, {
                        [parameterKey]: `%${condition}%`,
                    });
                }
            });
        }

        // ------------------ مرتب سازی ------------------
        if (getRows.sort) {
            Object.entries(getRows.sort).forEach(([field, direction]) => {
                const column = field.includes('.') ? field : `${alias}.${field}`;
                query.addOrderBy(column, direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
            });
        }

        // ------------------ modifyQuery custom ------------------
        if (modifyQuery) {
            modifyQuery(query, alias);
        }

        // ------------------ محاسبات (aggregation) ------------------
        if (getRows.computed?.length) {
            for (const comp of getRows.computed) {
                query.addSelect(comp.expression, comp.name);
            }
        }

        // ------------------ pagination ------------------
        query.skip((page - 1) * pageSize).take(pageSize);
        getRows.total = await query.getCount();
        const totalPages = Math.ceil(getRows.total / pageSize);

        const { entities, raw } = await query.getRawAndEntities();

        // ------------------ flattenView ------------------
        if (getRows.flattenView?.length || getRows.computed?.length) {
            getRows.data = entities.map((entity, index) => {
                const flatEntity = { ...entity };

                // flattenView
                if (getRows.flattenView?.length) {
                    for (const field of getRows.flattenView!) {
                        const [relation, property] = field.path.split('.');
                        const aliasKey = `${relation}_${property}`;
                        flatEntity[field.alias] = raw[index]?.[aliasKey] ?? null;
                    }
                    const relationsToRemove = new Set(getRows.flattenView.map(f => f.path.split('.')[0]));
                    for (const rel of relationsToRemove) {
                        delete (flatEntity as any)[rel];
                    }
                }

                // computed values
                if (getRows.computed?.length) {
                    for (const comp of getRows.computed) {
                        flatEntity[comp.name] = raw[index]?.[comp.name] ?? 0;
                    }
                }


                return flatEntity;
            });
        } else {
            getRows.data = entities;
        }

        delete getRows.flattenView;
        // ------------------ pagination result ------------------
        getRows.pagination = {
            currentPage: page,
            pageSize,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            firstPage: 1,
            lastPage: totalPages,
            nextTwoPages: page + 2 <= totalPages ? [page + 1, page + 2] : page + 1 <= totalPages ? [page + 1] : [],
            previousTwoPages: page - 2 >= 1 ? [page - 2, page - 1] : page - 1 >= 1 ? [page - 1] : [],
        };

        return getRows;
    }



    async remove(id: number): Promise<ActionResult<Entity>> {
        await this.repository.delete(id);
        return this.helperService.actionResult<Entity>(null, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

    async fineById(
        id: number,
        modifyQuery?: (query: SelectQueryBuilder<Entity>, alias: string) => void,
        alias: string = 'entity'
    ): Promise<ActionResult<Entity>> {
        const query = this.repository.createQueryBuilder(alias);

        if (modifyQuery) {
            modifyQuery(query, alias);
        }

        query.where({id});

        const data = await query.getOne();
        return this.helperService.actionResult(data, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }


    async getList<Dto = Entity>(
        modifyQuery?: (query: SelectQueryBuilder<Entity>, alias: string) => void,
        alias: string = 'entity',
        flattenView?: { path: string; alias: string }[],
        postProcess?: (entities: Dto[]) => Promise<Dto[]>
    ): Promise<ActionResult<Dto[]>> {
        const query = this.repository.createQueryBuilder(alias);
        if (modifyQuery) {
            modifyQuery(query, alias);
        }
        let data: Dto[];
        if (flattenView?.length) {
            const { entities, raw } = await query.getRawAndEntities();
            data = entities.map((entity, index) => {
                const flatEntity = { ...entity } as any;
                for (const field of flattenView) {
                    const [relation, ...properties] = field.path.split('.');
                    const aliasKey = `${relation}_${properties.join('_')}`;
                    flatEntity[field.alias] = raw[index]?.[aliasKey] ?? null;
                }
                return flatEntity as Dto;
            });
        } else {
            data = await query.getMany() as unknown as Dto[];
        }
        if (postProcess) {
            data = await postProcess(data);
        }
        return this.helperService.actionResult(data, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }


    protected flattenEntityWithRaw<T>(entity: T, raw: any, joinedAliases: string[]): T {
        const flatEntity = { ...entity } as any;

        for (const key in raw) {
            for (const alias of joinedAliases) {
                if (key.startsWith(`${alias}_`)) {
                    const flatKey = key.replace(`${alias}_`, '');
                    flatEntity[flatKey] = raw[key];
                }
            }
        }

        for (const alias of joinedAliases) {
            delete flatEntity[alias];
        }

        return flatEntity;
    }




}
