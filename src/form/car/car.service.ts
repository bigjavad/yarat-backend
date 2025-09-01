import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import {BaseService} from "../../core/service/base.service";
import {ImageService} from "../../core/service/image.service";
import {CarEntity} from "../../entity/car/car.entity";
import {ActionResult} from "../../core/model/base/action-result";
import {CarDto} from "../../core/model/dto/car/car.dto";
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {UserService} from "../user/user.service";
import {UploadPathConst} from "../../core/const/upload-path.const";
import {GetRows} from "../../core/model/base/get-rows";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";
import {HtmlProcessorService} from "../../core/service/html-processor.service";
import {sanitizeInput} from "../../core/utility/sanitize-input";
import {CreatorSlug} from "../../core/utility/creator-slug";

@Injectable()
export class CarService extends BaseService<CarEntity> {
    constructor(
        @InjectRepository(CarEntity)
        protected readonly car_repository: Repository<CarEntity>,
        protected readonly helperService: HelperService,
        private readonly userService: UserService,
        private imageService: ImageService,
        private readonly htmlProcessorService:HtmlProcessorService
    ) {
        super(car_repository, helperService);
    }

    async save(carDto: CarDto): Promise<ActionResult<CarEntity>> {
        carDto.slug = CreatorSlug([carDto.title]);
        carDto.image = await Promise.all(
            carDto.image.map(async (image: string) => {
                return await this.imageService.saveBase64Image(image, UploadPathConst.CAR);
            })
        );
        carDto.body = sanitizeInput(carDto.body);
        carDto.body = await this.htmlProcessorService.processHtmlImages(
            carDto.body,
            UploadPathConst.CAR
        );
        return this.helperService.actionResult(await this.car_repository.save(carDto), MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async update(carDto: CarDto): Promise<ActionResult<CarEntity>> {
        const car: ActionResult<CarEntity> = await this.fineById(carDto.id);
        carDto.slug = CreatorSlug([carDto.title]);
        car.data.image.map(async (image: string) => {
            return await this.imageService.deleteFile(image);
        })
        await this.htmlProcessorService.deleteImagesFromHtml(car.data.body);
        carDto.body = sanitizeInput(carDto.body);
        carDto.body = await this.htmlProcessorService.processHtmlImages(
            carDto.body,
            UploadPathConst.CAR
        );
        carDto.image = await Promise.all(
            carDto.image.map(async (image: string) => {
                return await this.imageService.saveBase64Image(image, UploadPathConst.CAR);
            })
        );
        const updatedCar = {...car.data, ...carDto};
        carDto = await this.car_repository.save(updatedCar);
        return this.helperService.actionResult(await this.car_repository.save(carDto), MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async remove(id: number): Promise<ActionResult<CarEntity>> {

        const car: ActionResult<CarEntity> = await this.fineById(id);
        if (car.data.body){
            await this.htmlProcessorService.deleteImagesFromHtml(car.data.body);
        }
        car.data.image.map(async (image: string) => {
            return await this.imageService.deleteFile(image);
        })
        await super.remove(id);
        return this.helperService.actionResult<CarEntity>(car.data, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

    async getRowsCar(getRows: GetRows<CarDto, CarEntity[]>): Promise<ActionResult<GetRows<CarDto, CarEntity[]>>> {
        getRows.flattenView = [
            {path: 'user.firstname', alias: 'firstname'},
            {path: 'user.lastname', alias: 'lastname'},
            {path: 'user.phoneNumber', alias: 'phoneNumber'},
            {path: 'carStatusValue.title', alias: 'carStatusTitle'},
            {path: 'carCategoryValue.title', alias: 'carCategoryTitle'},
        ];
        return this.helperService.actionResult(
            await super.getRows<CarDto>(getRows, (query, alias) => {
                query
                    .innerJoin(`${alias}.creator`, 'user')
                    .innerJoin(PropertyValueEntity, 'carStatusValue', `carStatusValue.serialNumber = ${alias}.carStatus`)
                    .innerJoin(PropertyValueEntity, 'carCategoryValue', `carCategoryValue.serialNumber = ${alias}.carCategory`)
                    .addSelect(['carStatusValue.title', 'user.firstname','carCategoryValue.title',
                        'user.phoneNumber', 'user.lastname'
                    ]);
            }, 'car'),
            MessageConst.GLOBAL.GET_ROWS,
            false,
            EN_Status.success
        );
    }

    async getListCar(): Promise<ActionResult<CarEntity[]>> {
        return await super.getList<CarEntity>(
            (query, alias) => {
                query.innerJoin(
                    PropertyValueEntity,
                    'carStatusValue',
                    `carStatusValue.serialNumber = ${alias}.carStatus`
                )
                    .addSelect(['carStatusValue.title AS carStatusValue_title']);
            },
            'car',
            [{ path: 'carStatusValue.title', alias: 'carStatusTitle' }],
            async (cars) => {
                for (const car of cars) {
                    await this.resolvePropertyValues(car);
                }
                return cars;
            }
        );
    }

    async getBySlug(slug: string): Promise<ActionResult<CarEntity>> {
        const query = this.car_repository.createQueryBuilder('car');
        query
            .innerJoin(
                PropertyValueEntity,
                'carStatusValue',
                `carStatusValue.serialNumber = car.carStatus`
            )
            .addSelect(['carStatusValue.title AS carStatusValue_title'])
            .where('car.slug = :slug', { slug });

        const { entities, raw } = await query.getRawAndEntities();
        if (!entities.length) {
            return this.helperService.actionResult(
                null,
                MessageConst.GLOBAL.NOT_FOUND,
                true,
                EN_Status.fail
            );
        }

        const car = entities[0];
        (car as any).carStatusTitle = raw[0]?.carStatusValue_title;

        await this.resolvePropertyValues(car);

        return this.helperService.actionResult(
            car,
            MessageConst.GLOBAL.SUCCESS,
            false,
            EN_Status.success
        );
    }

    private async resolvePropertyValues(car: any) {
        const objectFields = ['engine', 'suspensions', 'tire', 'break', 'dimensionsCapacity', 'expert', 'warranty'];
        for (const field of objectFields) {
            const items = car[field];
            if (Array.isArray(items) && items.length && typeof items[0] === 'object' && 'content' in items[0]) {
                const ids = items.map(i => i.id);
                const values = await this.car_repository.manager
                    .getRepository(PropertyValueEntity)
                    .createQueryBuilder('pv')
                    .where('pv.serialNumber IN (:...ids)', { ids })
                    .select(['pv.serialNumber', 'pv.title'])
                    .getMany();
                const titleMap = new Map(values.map(v => [v.serialNumber, v.title]));
                car[field] = items.map(i => ({
                    id: i.id,
                    content: i.content,
                    title: titleMap.get(i.id) || null,
                }));
            }
        }
        const facilities = car.facilities;
        if (Array.isArray(facilities) && facilities.length) {
            const values = await this.car_repository.manager
                .getRepository(PropertyValueEntity)
                .createQueryBuilder('pv')
                .where('pv.serialNumber IN (:...serials)', { serials: facilities })
                .select(['pv.serialNumber', 'pv.title'])
                .getMany();

            car.facilitiesList = values.map(v => ({
                id: v.serialNumber,
                title: v.title,
                content: null,
            }));
        } else {
            car.facilitiesList = [];
        }
    }


}
