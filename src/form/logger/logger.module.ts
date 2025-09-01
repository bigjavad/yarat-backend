import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerEntity} from "../../entity/logger/logger.entity";
import {HelperService} from "../../core/service/helper.service";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [LoggerController],
  providers: [LoggerService,HelperService],
  imports: [
      UserModule,
    TypeOrmModule.forFeature([LoggerEntity]),
  ],
  exports:[LoggerService]
})
export class LoggerModule {}
