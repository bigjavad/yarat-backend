import {PropertyValueEntity} from "../../../entity/property/property-value.entity";
import {BaseService} from "../../../core/service/base.service";
import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../../core/service/helper.service";
import {PropertyValueDto} from "../../../core/model/dto/property/property-value.dto";
import {ActionResult} from "../../../core/model/base/action-result";
import {MessageConst} from "../../../core/const/message.const";
import {EN_Status} from "../../../core/enum/base/EN_Status";
import {EN_ExceptionMessage} from "../../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../../core/enum/base/EN_ExceptionStatus";
import {GetRows} from "../../../core/model/base/get-rows";

@Injectable()
export class PropertyValueService extends BaseService<PropertyValueEntity> {

    constructor(
        @InjectRepository(PropertyValueEntity)
        private Property_value_repository: Repository<PropertyValueEntity>,
        protected helperService: HelperService,
    ) {
        super(Property_value_repository, helperService);
    }

    async savePropertyValue(propertyDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity>> {
        const property =await this.Property_value_repository.save(propertyDto);
        return this.helperService.actionResult(property, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async updatePropertyValue(propertyValueDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity>> {
        const property: PropertyValueEntity = await this.propertyValueStatus(propertyValueDto.id);
        const updatedPropertyValue = { ...property, ...propertyValueDto };
        const propertyValue= await this.Property_value_repository.save(updatedPropertyValue);
        return this.helperService.actionResult<PropertyValueEntity>(propertyValue, MessageConst.GLOBAL.UPDATE, true, EN_Status.success);
    }


    public async propertyValueStatus(id: number): Promise<PropertyValueEntity> {
        const propertyValue: ActionResult<PropertyValueEntity> = await super.fineById(id);
        if (!propertyValue.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return propertyValue.data
    }

    async getRowsPropertyValue(getRows: GetRows<PropertyValueDto, PropertyValueEntity[]>): Promise<ActionResult<GetRows<PropertyValueDto, PropertyValueEntity[]>>> {
        return this.helperService.actionResult(await super.getRows<PropertyValueDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }

    async getByParentId(propertyValueDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity[]>> {
        const property:PropertyValueEntity[] =await this.Property_value_repository.find({
            where:{
                propertyId:propertyValueDto.propertyId
            }
        })
        return this.helperService.actionResult(property, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }

}
