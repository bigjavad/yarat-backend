import {Injectable} from '@nestjs/common';
import {HelperService} from "../../core/service/helper.service";
import {UploadDto} from "../../core/model/dto/upload/upload.dto";
import {ImageService} from "../../core/service/image.service";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {ActionResult} from "../../core/model/base/action-result";

@Injectable()
export class UploadService {

    constructor(
        protected readonly helperService: HelperService,
        private imageService:ImageService
    ) {
    }

    async uploadImage(uploadDto: UploadDto):Promise<ActionResult<UploadDto>> {
        uploadDto.data =await this.imageService.saveBase64Image(uploadDto.data, uploadDto.path);
        return this.helperService.actionResult<UploadDto>(uploadDto, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async deleteImage(uploadDto: UploadDto):Promise<ActionResult<UploadDto>>{
        await this.imageService.deleteFile(uploadDto.data);
        return this.helperService.actionResult<UploadDto>(uploadDto, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

    async deleteVideo(uploadDto: UploadDto):Promise<ActionResult<UploadDto>>{
        await this.imageService.deleteFile(uploadDto.data);
        return this.helperService.actionResult<UploadDto>(uploadDto, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

}
