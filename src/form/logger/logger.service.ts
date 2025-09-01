import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LoggerEntity} from "../../entity/logger/logger.entity";
import {LoggerDto} from "../../core/model/dto/logger/logger.dto";
import {BaseService} from "../../core/service/base.service";
import {HelperService} from "../../core/service/helper.service";
import {GetRows} from "../../core/model/base/get-rows";
import {ActionResult} from "../../core/model/base/action-result";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";

@Injectable()
export class LoggerService extends BaseService<LoggerEntity>{

  constructor(
      @InjectRepository(LoggerEntity)
      protected readonly logger_repository: Repository<LoggerEntity>,
      protected readonly helperService: HelperService
  ) {
    super(logger_repository,helperService);
  }

  async save(createLoggerDto:LoggerDto):Promise<LoggerEntity>{
    return this.logger_repository.save<LoggerDto>(createLoggerDto);
  }

  async getRowsLogger(getRows: GetRows<LoggerDto, LoggerEntity[]>): Promise<ActionResult<GetRows<LoggerDto, LoggerEntity[]>>> {
    return this.helperService.actionResult(await super.getRows<LoggerDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
  }

}
