import {Controller, Post, Body, UseGuards, Get} from '@nestjs/common';
import { CategoryMenuService } from './category-menu.service';
import {REST_CONST} from "../../core/const/rest.const";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {CategoryMenuDto} from "../../core/model/dto/category-menu/category-menu.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {GetRows} from "../../core/model/base/get-rows";
import {CategoryMenuEntity} from "../../entity/category-menu/category-menu.entity";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.CATEGORY_MENU)
export class CategoryMenuController {
  constructor(private readonly categoryService: CategoryMenuService) {}

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.SAVE)
  save(@Body() categoryDto: CategoryMenuDto):Promise<ActionResult<CategoryMenuDto>> {
    return this.categoryService.saveCategoryMenu(categoryDto);
  }

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.UPDATE)
  update (@Body() categoryDto: CategoryMenuDto):Promise<ActionResult<CategoryMenuDto>> {
    return this.categoryService.updateCategoryMenu(categoryDto);
  }

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.REMOVE)
  remove (@Body() id: number):Promise<ActionResult<CategoryMenuDto>> {
    return this.categoryService.remove(id);
  }

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.GET_ROWS)
  getRows(@Body() getList: GetRows<CategoryMenuDto, CategoryMenuEntity[]>): Promise<ActionResult<GetRows<CategoryMenuDto, CategoryMenuEntity[]>>> {
    return this.categoryService.getRowsCategoryMenu(getList);
  }

  @Get(REST_CONST.GLOBAL.GET_LIST)
  async getList():Promise<ActionResult<CategoryMenuEntity[]>>{
    return this.categoryService.getListCategoryMenu();
  }

}
