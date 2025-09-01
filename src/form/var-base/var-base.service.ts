import {Injectable} from '@nestjs/common';
import {HelperService} from "../../core/service/helper.service";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {ActionResult} from "../../core/model/base/action-result";


@Injectable()
export class VarBaseService {

    constructor(
        protected helperService: HelperService,
    ) {
    }
    async getToday() :Promise<ActionResult<Date>>{
        return this.helperService.actionResult<Date>(new Date(), MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }
}
