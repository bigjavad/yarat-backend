import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {GalleryService} from "./gallery.service";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {GalleryDto} from "../../core/model/dto/gallery/gallery.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {GalleryEntity} from "../../entity/gallery/gallery.entity";
import {RoleGuard} from "../../core/guard/role.guard";
import {GetRows} from "../../core/model/base/get-rows";

@Controller(CONTROLLER_CONST.GALLERY)
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    async save(@Body() galleryDto:GalleryDto):Promise<ActionResult<GalleryEntity>>{
        return this.galleryService.save(galleryDto);
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() galleryDto: GalleryDto): Promise<ActionResult<GalleryDto>> {
        return this.galleryService.updateGallery(galleryDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<GalleryEntity>> {
        return this.galleryService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<GalleryDto, GalleryEntity[]>): Promise<ActionResult<GetRows<GalleryDto, GalleryEntity[]>>> {
        return this.galleryService.getRowsGallery(getList);
    }


}
