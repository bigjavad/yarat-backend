import { Module } from '@nestjs/common';
import { CategoryMenuService } from './category-menu.service';
import { CategoryMenuController } from './category-menu.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {CategoryMenuEntity} from "../../entity/category-menu/category-menu.entity";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [CategoryMenuController],
  providers: [CategoryMenuService,HelperService],
  imports: [
      UserModule,
      TypeOrmModule.forFeature([CategoryMenuEntity]),
  ]
})
export class CategoryMenuModule {}
