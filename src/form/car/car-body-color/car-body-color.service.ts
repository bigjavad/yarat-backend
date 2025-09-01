import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../../core/service/helper.service";
import {BaseService} from "../../../core/service/base.service";
import {CarBodyColorDto} from "../../../core/model/dto/car/car-body-color.dto";
import {CarBodyColorEntity} from "../../../entity/car/car-body-color.entity";
import {ActionResult} from "../../../core/model/base/action-result";
import {MessageConst} from "../../../core/const/message.const";
import {EN_Status} from "../../../core/enum/base/EN_Status";
import {EN_ExceptionMessage} from "../../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../../core/enum/base/EN_ExceptionStatus";
import {GetRows} from "../../../core/model/base/get-rows";
import {UploadPathConst} from "../../../core/const/upload-path.const";
import {ImageService} from "../../../core/service/image.service";

@Injectable()
export class CarBodyColorService extends BaseService<CarBodyColorEntity>{

    constructor(
        @InjectRepository(CarBodyColorEntity)
        protected readonly car_body_color_repository: Repository<CarBodyColorEntity>,
        protected readonly helperService: HelperService,
        private imageService: ImageService
    ) {
        super(car_body_color_repository,helperService);
    }

    async saveCarBodyColor(carBodyColorDto: CarBodyColorDto):Promise<ActionResult<CarBodyColorEntity>> {
        if (carBodyColorDto.image ){

            carBodyColorDto.image = await this.imageService.saveBase64Image(carBodyColorDto.image, UploadPathConst.CAR_BODY_COLOR);
        }
        const carBodyColor :CarBodyColorEntity=await this.car_body_color_repository.save(carBodyColorDto);
        return this.helperService.actionResult(carBodyColor, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async updateCarBodyColor(carBodyColorDto: CarBodyColorDto): Promise<ActionResult<CarBodyColorDto>> {
        const carBodyColor: CarBodyColorEntity = await this.carBodyColorStatus(carBodyColorDto.id);
        if (carBodyColorDto.image != carBodyColorDto.image){
            await this.imageService.deleteFile(carBodyColor.image);
            carBodyColorDto.image = await this.imageService.saveBase64Image(carBodyColorDto.image, UploadPathConst.CAR_BODY_COLOR);
        }
        const updatedCarBodyColor = {...carBodyColor, ...carBodyColorDto};
        carBodyColorDto = await this.car_body_color_repository.save(updatedCarBodyColor);
        return this.helperService.actionResult<CarBodyColorDto>(carBodyColorDto, MessageConst.GLOBAL.UPDATE, true, EN_Status.success);
    }

    async carBodyColorStatus(id:number){
        const carBodyColor: ActionResult<CarBodyColorEntity> = await super.fineById(id);
        if (!carBodyColor.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return carBodyColor.data
    }

    async getRowsCarBodyColor(getRows: GetRows<CarBodyColorDto, CarBodyColorEntity[]>): Promise<ActionResult<GetRows<CarBodyColorDto, CarBodyColorEntity[]>>> {
        return this.helperService.actionResult(await super.getRows<CarBodyColorDto>(getRows), MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }

    async remove(id: number): Promise<ActionResult<CarBodyColorEntity>> {
        const carBodyColor: CarBodyColorEntity = await this.carBodyColorStatus(id);
        await this.imageService.deleteFile(carBodyColor.image);
        await super.remove(id);
        return this.helperService.actionResult<CarBodyColorEntity>(carBodyColor, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }


}
