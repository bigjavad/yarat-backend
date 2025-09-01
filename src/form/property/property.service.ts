import { HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm"
import {HelperService} from "../../core/service/helper.service";
import {BaseService} from 'src/core/service/base.service';
import {PropertyEntity} from "../../entity/property/property.entity";
import {ActionResult} from "../../core/model/base/action-result";
import {GetRows} from "../../core/model/base/get-rows";
import {PropertyDto} from "../../core/model/dto/property/property.dto";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";

@Injectable()
export class PropertyService extends BaseService<PropertyEntity> {

    constructor(
        @InjectRepository(PropertyEntity)
        private property_repository: Repository<PropertyEntity>,
        protected helperService: HelperService,
    ) {
        super(property_repository, helperService);
    }

    async saveProperty(propertyDto: PropertyDto): Promise<ActionResult<PropertyEntity>> {
        const property =await this.property_repository.save(propertyDto);
        return this.helperService.actionResult(property, MessageConst.GLOBAL.SAVE, false, EN_Status.success);
    }

    async updateProperty(propertyDto: PropertyDto): Promise<ActionResult<PropertyEntity>> {
        let property: PropertyEntity = await this.propertyStatus(propertyDto.id);
        const updatedProperty = {...property, ...propertyDto};
        property = await this.property_repository.save(updatedProperty);
        return this.helperService.actionResult<PropertyEntity>(property, MessageConst.GLOBAL.UPDATE, true, EN_Status.success);
    }

    public async propertyStatus(id: number): Promise<PropertyEntity> {
        const property: ActionResult<PropertyEntity> = await super.fineById(id);
        if (!property.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return property.data
    }

    async getRowsProperty(getRows: GetRows<PropertyDto, PropertyEntity[]>): Promise<ActionResult<GetRows<PropertyDto, PropertyEntity[]>>> {
        return this.helperService.actionResult(await super.getRows<PropertyDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }

}
