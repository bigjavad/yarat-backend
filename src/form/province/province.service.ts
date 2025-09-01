import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import { BaseService } from 'src/core/service/base.service';
import {ProvinceEntity} from "../../entity/province/province.entity";
import {ProvinceDto} from "../../core/model/dto/province/province.dto";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {ActionResult} from "../../core/model/base/action-result";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {GetRows} from "../../core/model/base/get-rows";
import {UploadPathConst} from "../../core/const/upload-path.const";
import {ImageService} from "../../core/service/image.service";

@Injectable()
export class ProvinceService extends BaseService<ProvinceEntity>{

    constructor(
        @InjectRepository(ProvinceEntity)
        private readonly province_repository: Repository<ProvinceEntity>,
        private readonly imageService:ImageService,
        protected readonly helperService: HelperService,
    ) {
        super(province_repository,helperService);
    }

    async saveProvince(provinceDto: ProvinceDto):Promise<ActionResult<ProvinceEntity>> {
        provinceDto.image = await this.imageService.saveBase64Image(provinceDto.image, UploadPathConst.PROVINCE);
        const province :ProvinceEntity=await this.province_repository.save(provinceDto);
        return this.helperService.actionResult(province, MessageConst.GLOBAL.SAVE, false, EN_Status.success);
    }

    async updateProvince(provinceDto: ProvinceDto): Promise<ActionResult<ProvinceDto>> {
        const province: ProvinceEntity = await this.provinceStatus(provinceDto.id);
        if (provinceDto.image !=province.image){
            if (province.image){
                await this.imageService.deleteFile(province.image);
            }
            provinceDto.image = await this.imageService.saveBase64Image(provinceDto.image, UploadPathConst.PROVINCE);
        }
        const updatedProvince = {...province, ...provinceDto};
        provinceDto = await this.province_repository.save(updatedProvince);
        return this.helperService.actionResult<ProvinceDto>(provinceDto, MessageConst.GLOBAL.UPDATE, true, EN_Status.success);
    }

    async provinceStatus(id:number){
        const province: ActionResult<ProvinceEntity> = await super.fineById(id);
        if (!province.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return province.data
    }

    async getRowsProvince(getRows: GetRows<ProvinceDto, ProvinceEntity[]>): Promise<ActionResult<GetRows<ProvinceDto, ProvinceEntity[]>>> {
        return this.helperService.actionResult(await super.getRows<ProvinceDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }

    async remove(id: number): Promise<ActionResult<ProvinceEntity>> {
        const province: ProvinceEntity = await this.provinceStatus(id);
        if (province.image) {
            await this.imageService.deleteFile(province.image);
        }
        await super.remove(id);
        return this.helperService.actionResult<ProvinceEntity>(province, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }


}
