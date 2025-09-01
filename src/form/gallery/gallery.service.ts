import {HttpException, Injectable} from "@nestjs/common";
import {BaseService} from "../../core/service/base.service";
import {GalleryEntity} from "../../entity/gallery/gallery.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import {ImageService} from "../../core/service/image.service";
import {GalleryDto} from "../../core/model/dto/gallery/gallery.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {EN_GalleryTypeEnum} from "../../core/enum/form/EN_GalleryType.enum";
import {UploadPathConst} from "../../core/const/upload-path.const";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {GetRows} from "../../core/model/base/get-rows";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";


@Injectable()
export class GalleryService extends BaseService<GalleryEntity> {
    constructor(
        @InjectRepository(GalleryEntity)
        protected readonly gallery_repository: Repository<GalleryEntity>,
        protected readonly helperService: HelperService,
        private readonly imageService: ImageService
    ) {
        super(gallery_repository, helperService);
    }

    async save(galleryDto: GalleryDto): Promise<ActionResult<GalleryEntity>> {
        if (galleryDto.galleryType == EN_GalleryTypeEnum.IMAGE) {
            galleryDto.file = await this.imageService.saveBase64Image(galleryDto.file, UploadPathConst.GALLERY);
        } else {
            galleryDto.file = await this.imageService.saveBase64Video(galleryDto.file, UploadPathConst.GALLERY);
        }
        const gallery: GalleryEntity = await this.gallery_repository.save(galleryDto);
        return this.helperService.actionResult(gallery, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async updateGallery(galleryDto: GalleryDto): Promise<ActionResult<GalleryDto>> {
        const gallery: GalleryEntity = await this.galleryStatus(galleryDto.id);
        if (galleryDto.file !=gallery.file){
            await this.imageService.deleteFile(gallery.file);
        }
        const updatedGallery = {...gallery, ...galleryDto};
        galleryDto = await this.gallery_repository.save(updatedGallery);
        return this.helperService.actionResult<GalleryDto>(galleryDto, MessageConst.USER.UPDATE, true, EN_Status.success);
    }

    async galleryStatus(id: number): Promise<GalleryEntity> {
        const gallery: ActionResult<GalleryEntity> = await super.fineById(id);
        if (!gallery.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return gallery.data
    }

    async remove(id: number): Promise<ActionResult<GalleryEntity>> {
        const gallery: GalleryEntity = await this.galleryStatus(id);
        await this.imageService.deleteFile(gallery.file);
        await super.remove(id);
        return this.helperService.actionResult<GalleryEntity>(gallery, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

    async getRowsGallery(getRows: GetRows<GalleryDto, GalleryEntity[]>): Promise<ActionResult<GetRows<GalleryDto, GalleryEntity[]>>> {
        getRows.flattenView = [
            { path: 'galleryTypeValue.title', alias: 'galleryTypeTitle' },
        ]
        return this.helperService.actionResult(
            await super.getRows<GalleryDto>(getRows, (query, alias) => {
                query
                    .innerJoin(PropertyValueEntity, 'galleryTypeValue', `galleryTypeValue.serialNumber = ${alias}.galleryType`)
                    .addSelect([
                        'galleryTypeValue.title',
                        'galleryTypeValue.id'
                    ])
            }, 'categoryMenu')
            , MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);    }
}
