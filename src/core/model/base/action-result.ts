import {EN_Status} from "../../enum/base/EN_Status";


export class ActionResult<T>{
    data:T;
    message:string;
    toast:boolean;
    status:EN_Status
}
