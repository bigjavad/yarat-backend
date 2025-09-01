import {Controller, Post, Body, UseGuards} from '@nestjs/common';
import { LoggerService } from './logger.service';
import {LoggerDto} from "../../core/model/dto/logger/logger.dto";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {GetRows} from "../../core/model/base/get-rows";
import {ActionResult} from "../../core/model/base/action-result";
import {LoggerEntity} from "../../entity/logger/logger.entity";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.LOGGER)
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.GET_ROWS)
  getRows(@Body() getList: GetRows<LoggerDto, LoggerEntity[]>): Promise<ActionResult<GetRows<LoggerDto, LoggerEntity[]>>> {
    return this.loggerService.getRowsLogger(getList);
  }

}
