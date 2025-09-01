import {Controller, Get} from '@nestjs/common';
import {VarBaseService} from "./var-base.service";
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";


@Controller(CONTROLLER_CONST.BASE_VAR)
export class VarBaseController {

    constructor(private readonly varBaseService: VarBaseService) {
    }

    @Get(REST_CONST.BASE_VAR.GET_TODAY)
    getToday(): Promise<ActionResult<Date>> {
        return this.varBaseService.getToday();
    }

}
