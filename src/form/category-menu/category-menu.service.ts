import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {HelperService} from "../../core/service/helper.service";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {CategoryMenuDto} from "../../core/model/dto/category-menu/category-menu.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {CategoryMenuEntity} from "../../entity/category-menu/category-menu.entity";
import {BaseService} from "../../core/service/base.service";
import {GetRows} from "../../core/model/base/get-rows";
import {UploadPathConst} from "../../core/const/upload-path.const";
import {ImageService} from "../../core/service/image.service";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";
import {PostEntity} from "../../entity/post/post.entity";

@Injectable()
export class CategoryMenuService extends BaseService<CategoryMenuEntity>{

  constructor(
      @InjectRepository(CategoryMenuEntity)
      protected readonly category_menu_repository: Repository<CategoryMenuEntity>,
      protected readonly helperService: HelperService,
      private imageService:ImageService
  ) {
    super(category_menu_repository,helperService);
  }
  async saveCategoryMenu(categoryDto: CategoryMenuDto):Promise<ActionResult<CategoryMenuDto>> {
    if (categoryDto.image) categoryDto.image = await this.imageService.saveBase64Image(categoryDto.image, UploadPathConst.CATEGORY_MENU);
    const category:CategoryMenuEntity = await this.category_menu_repository.create(categoryDto);
    return this.category_menu_repository.save(category).then((res:CategoryMenuEntity)=>{
      return this.helperService.actionResult<CategoryMenuDto>(res,MessageConst.CATEGORY.CREATE,true,EN_Status.success);
    })
  }

  async updateCategoryMenu(categoryDto: CategoryMenuDto):Promise<ActionResult<CategoryMenuDto>> {
    let category:CategoryMenuEntity=new CategoryMenuEntity();
    super.fineById(categoryDto.id).then((res:ActionResult<CategoryMenuEntity>)=>{
      if (!res.data) {
        throw new HttpException(EN_ExceptionMessage.CATEGORY_NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
      }
      category = res.data;
    })
    let updatedCategory = {...category, ...categoryDto};
    categoryDto = this.helperService.mapper<CategoryMenuDto,CategoryMenuEntity>(categoryDto,await this.category_menu_repository.save(updatedCategory))
    return this.helperService.actionResult<CategoryMenuDto>(categoryDto, MessageConst.CATEGORY.UPDATE, true, EN_Status.success);
  }

  async getRowsCategoryMenu(getRows: GetRows<CategoryMenuDto, CategoryMenuEntity[]>): Promise<ActionResult<GetRows<CategoryMenuDto, CategoryMenuEntity[]>>> {
    getRows.flattenView = [
      { path: 'categoryStatusValue.title', alias: 'categoryStatusTitle' },
    ]
    return this.helperService.actionResult(
        await super.getRows<CategoryMenuDto>(getRows, (query, alias) => {
          query
              .innerJoin(PropertyValueEntity, 'categoryStatusValue', `categoryStatusValue.serialNumber = ${alias}.categoryStatus`)
              .addSelect([
                  'categoryStatusValue.title'
              ])
        }, 'categoryMenu')
        , MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
  }

  getListCategoryMenu() {
    return super.getList((query, alias) => {
      query
          .innerJoin(PropertyValueEntity, 'categoryStatusValue', `categoryStatusValue.serialNumber = ${alias}.categoryStatus`)
          .addSelect(['categoryStatusValue.title AS categoryStatusValue_title',])
    },
        'categoryMenu',
        [
          { path: 'categoryStatusValue.title', alias: 'categoryStatusTitle' }]);
  }
}
