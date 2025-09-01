import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {UploadDto} from "../../core/model/dto/upload/upload.dto";

@Controller(CONTROLLER_CONST.UPLOAD)
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.UPLOAD.UPLOAD_IMAGE)
    uploadImage(@Body() uploadDto: UploadDto):Promise<ActionResult<UploadDto>>{
        return this.uploadService.uploadImage(uploadDto)
    }

    @Post(REST_CONST.UPLOAD.DELETE_IMAGE)
    async deleteImage(@Body() uploadDto: UploadDto):Promise<ActionResult<UploadDto>>{
        return this.uploadService.deleteImage(uploadDto);
    }

    @Post(REST_CONST.UPLOAD.DELETE_VIDEO)
    async deleteVideo(@Body() uploadDto: UploadDto):Promise<ActionResult<UploadDto>>{
        return this.uploadService.deleteVideo(uploadDto);
    }



}
