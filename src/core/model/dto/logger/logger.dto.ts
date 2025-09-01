import {BaseEntityModel} from "../../../entity/base-entity-model";


export class LoggerDto extends BaseEntityModel{
    method:string;
    baseUrl:string;
    statusCode:number;
    contentLength:string;
    responseTime:string;
    userAgent:string;
    ip:string;
}
