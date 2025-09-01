import {Injectable} from "@nestjs/common";
import {EN_Status} from "../enum/base/EN_Status";
import {ActionResult} from "../model/base/action-result";

@Injectable()
export class HelperService {

    public creatorFullName(data:string[]):string{
        return data[0] + " " + data[1]
    }

    public actionResult<T>(data:T, message:string, toast:boolean, status:EN_Status): ActionResult<T> {
        const model: ActionResult<T> = new ActionResult<T>();
        model.message =message;
        model.data = data;
        model.toast = toast;
        model.status = status;
        return model;
    }

    public mapper<INPUT,OUTPUT>(data:INPUT, res:OUTPUT):OUTPUT {
        let model:OUTPUT= res;
        Object.keys(data).forEach((key:string)=>{
            if (data[key]){
                model[key] = data[key];
            }
        })
        return model;
    }

}
