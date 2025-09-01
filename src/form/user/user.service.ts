import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, Repository} from "typeorm"
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import * as bcrypt from 'bcryptjs';
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {HelperService} from "../../core/service/helper.service";
import {BaseService} from 'src/core/service/base.service';
import {UserEntity} from "../../entity/user/user.entity";
import {ActionResult} from "../../core/model/base/action-result";
import {GetRows} from "../../core/model/base/get-rows";
import {UserDto} from "../../core/model/dto/user/user.dto";
import {ImageService} from "../../core/service/image.service";
import {UserCountRoleDto} from "../../core/model/dto/user/user-count-role.dto";
import {TelegramService} from "../../external/telegram/telegram.service";
import {LoginDto} from "../../core/model/dto/auth/login.dto";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";

@Injectable()
export class UserService extends BaseService<UserEntity> {

    constructor(
        @InjectRepository(UserEntity)
        private user_repository: Repository<UserEntity>,
        private imageService: ImageService,
        protected helperService: HelperService,
        private telegramService: TelegramService,
    ) {
        super(user_repository, helperService);
    }

    async saveUser(createUserDto: UserDto): Promise<ActionResult<UserDto>> {
        const user: UserEntity = await this.findUserByMobile(createUserDto.phoneNumber);
        if (user) throw new HttpException(EN_ExceptionMessage.AUTH_FIND_USER, EN_ExceptionStatus.BAD_REQUEST);
        if (createUserDto.password) createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        createUserDto = this.helperService.mapper<UserEntity,UserDto>(await this.save(createUserDto),createUserDto);
        return this.helperService.actionResult<UserDto>(createUserDto, MessageConst.USER.SAVE, true, EN_Status.success);
    }

    async save(userDto:UserDto|LoginDto|UserEntity):Promise<UserEntity>{
        return this.user_repository.save<UserDto|LoginDto | UserEntity>(userDto);
    }

    async updateUser(updateUserDto: UserDto): Promise<ActionResult<UserDto>> {
        const user: UserEntity = await this.userStatus(updateUserDto.id);
        if (updateUserDto.password) updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        else updateUserDto.password = user.password;
        const updatedUser = {...user, ...updateUserDto};
        updateUserDto = await this.user_repository.save(updatedUser);
        return this.helperService.actionResult<UserDto>(updateUserDto, MessageConst.USER.UPDATE, true, EN_Status.success);
    }

    public async userStatus(id: number): Promise<UserEntity> {
        const user: ActionResult<UserEntity> = await super.fineById(id);
        if (!user.data) {
            throw new HttpException(EN_ExceptionMessage.USER_NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return user.data
    }

    async findUserByMobile(phoneNumber: string): Promise<UserEntity> {
        return await this.user_repository.findOne({
            where: [{
                phoneNumber: phoneNumber
            }],
        });
    }

    async findRoleUserByMobile(userDto: UserDto): Promise<ActionResult<UserDto>> {
        const user = await this.user_repository.findOne({
            where: [{
                phoneNumber: userDto.phoneNumber,
                role:EN_RoleEnum.USER
            }],
        });
        if (!user) {
            throw new HttpException(EN_ExceptionMessage.USER_NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return this.helperService.actionResult(this.helperService.mapper(user,new UserDto()), MessageConst.GLOBAL.SUCCESS, true, EN_Status.success);
    }

    async getRowsUsers(getRows: GetRows<UserDto, UserEntity[]>): Promise<ActionResult<GetRows<UserDto, UserEntity[]>>> {
        getRows.flattenView = [
            { path: 'province.title', alias: 'provinceTitle' },
            { path: 'city.title', alias: 'cityTitle' },
            { path: 'roleValue.title', alias: 'roleTitle' }
        ];

        return this.helperService.actionResult(
            await super.getRows<UserDto>(getRows, (query, alias) => {
                query
                    .innerJoin(`${alias}.province`, 'province')
                    .innerJoin(`${alias}.city`, 'city')
                    .innerJoin(PropertyValueEntity, 'roleValue', `roleValue.serialNumber = ${alias}.role`)
                    .addSelect(['province.title', 'city.title', 'roleValue.title']);
            }, 'user'),
            MessageConst.GLOBAL.GET_ROWS,
            false,
            EN_Status.success
        );
    }



    async getUserCountRole(userCountRoleDto: UserCountRoleDto): Promise<ActionResult<UserCountRoleDto>> {
        const start = new Date(userCountRoleDto.startDate);
        const end = new Date();
        const completeData = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + 1);
            const count = await this.user_repository.count({
                where: {
                    createdDate: Between(currentDate, nextDate),
                    role: userCountRoleDto.role
                },
            });
            completeData.push({count, date: new Date(dateKey)});
            currentDate = nextDate;
        }
        return this.helperService.actionResult({
            startDate: userCountRoleDto.startDate,
            data: completeData,
            role: userCountRoleDto.role
        }, MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }



}
