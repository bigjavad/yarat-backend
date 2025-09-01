import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import {BaseService} from "../../core/service/base.service";
import {CityEntity} from "../../entity/city/city.entity";
import {CityDto} from "../../core/model/dto/city/city.dto";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {GetRows} from "../../core/model/base/get-rows";
import {ActionResult} from "../../core/model/base/action-result";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";

@Injectable()
export class CityService extends BaseService<CityEntity>{
    constructor(
        @InjectRepository(CityEntity)
        protected readonly city_repository: Repository<CityEntity>,
        protected readonly helperService: HelperService
    ) {
        super(city_repository,helperService);
    }

    async save(cityDto:CityDto):Promise<ActionResult<CityEntity>>{
        const city :CityEntity=await this.city_repository.save(cityDto);
        return this.helperService.actionResult(city, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async getCityById(provinceId: number): Promise<ActionResult<CityEntity[]>> {
        return super.getList((query, alias) => {
            query.where(`${alias}.provinceId = :provinceId`, { provinceId });
        });
    }

    async updateCity(cityDto: CityDto): Promise<ActionResult<CityDto>> {
        const city: CityEntity = await this.cityStatus(cityDto.id);
        const updatedCity = {...city, ...cityDto};
        cityDto = await this.city_repository.save(updatedCity);
        return this.helperService.actionResult<CityDto>(cityDto, MessageConst.USER.UPDATE, true, EN_Status.success);
    }

    async cityStatus(id:number):Promise<CityEntity>{
        const city: ActionResult<CityEntity> = await super.fineById(id);
        if (!city.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return city.data
    }

    async getRowsCity(getRows: GetRows<CityDto, CityEntity[]>): Promise<ActionResult<GetRows<CityDto, CityEntity[]>>> {
        return this.helperService.actionResult(await super.getRows<CityDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }
}
