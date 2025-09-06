import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import {BaseService} from 'src/core/service/base.service';
import {MessageConst} from "../../core/const/message.const";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {GetRows} from "../../core/model/base/get-rows";
import {OrdersEntity} from "../../entity/orders/orders.entity";
import {ActionResult} from "../../core/model/base/action-result";
import {OrdersDto} from "../../core/model/dto/orders/orders.dto";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";
import {EN_OrderStatusEnum} from "../../core/enum/form/EN_OrderStatusEnum";
import {SmsService} from "../../external/sms/sms.service";
import {UserEntity} from "../../entity/user/user.entity";
import {UserService} from "../user/user.service";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {UserDto} from "../../core/model/dto/user/user.dto";

@Injectable()
export class OrdersService extends BaseService<OrdersEntity> {

    constructor(
        @InjectRepository(OrdersEntity)
        private readonly orders_repository: Repository<OrdersEntity>,
        protected readonly helperService: HelperService,
        private readonly smsService: SmsService,
        private readonly userService: UserService
    ) {
        super(orders_repository, helperService);
    }

    async save(ordersDto: OrdersDto): Promise<ActionResult<OrdersEntity>> {
        const orders: OrdersEntity = await this.orders_repository.save(ordersDto);
        const user: UserEntity = (await this.userService.fineById(ordersDto.creatorId)).data;
        if (user.role != EN_RoleEnum.ADMIN) {
            const checkOrders = this.orders_repository.findOne({
                where: {
                    creatorId: user.id
                }
            })
            if (checkOrders){
                if ((await checkOrders).carId == ordersDto.carId){
                    throw new HttpException(EN_ExceptionMessage.ORDERS_CAR_ID_UNIQUE, EN_ExceptionStatus.BAD_REQUEST);
                }else if (checkOrders){
                    throw new HttpException(EN_ExceptionMessage.ORDERS_UNIQUE, EN_ExceptionStatus.BAD_REQUEST);
                }
            }

        }
        if (user.role != EN_RoleEnum.ADMIN) {
            const userDto: UserDto = this.helperService.mapper(user, new UserDto());
            userDto.fullName = this.helperService.creatorFullName([userDto.firstname, userDto.lastname]);
            // await this.smsService.sendMessage(user.phoneNumber, sendSaveRequestOrder(userDto));
        }
        orders.orderStatus = EN_OrderStatusEnum.ORDER_STATUS_UNDER_REVIEW;
        return this.helperService.actionResult(orders, MessageConst.GLOBAL.SAVE, true, EN_Status.success);
    }

    async updateOrders(ordersDto: OrdersDto): Promise<ActionResult<OrdersDto>> {
        const orders: OrdersEntity = await this.ordersStatus(ordersDto.id);
        const updatedOrders = {...orders, ...ordersDto};
        ordersDto = await this.orders_repository.save(updatedOrders);
        return this.helperService.actionResult<OrdersDto>(ordersDto, MessageConst.USER.UPDATE, true, EN_Status.success);
    }

    async completed(ordersDto: OrdersDto):Promise<ActionResult<OrdersEntity>>{
        let order:OrdersEntity = await this.ordersStatus(ordersDto.id);
        order.orderStatus = EN_OrderStatusEnum.ORDER_STATUS_COMPLETED;
        order = await this.orders_repository.save(order);
        return this.helperService.actionResult<OrdersEntity>(order, MessageConst.GLOBAL.SUCCESS, true, EN_Status.success);
    }



    async ordersStatus(id: number): Promise<OrdersEntity> {
        const orders: ActionResult<OrdersEntity> = await super.fineById(id);
        if (!orders.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return orders.data
    }

    async getRowsOrders(getRows: GetRows<OrdersDto, OrdersEntity[]>): Promise<ActionResult<GetRows<OrdersDto, OrdersEntity[]>>> {
        getRows.flattenView = [
            {path: 'user.firstname', alias: 'firstname'},
            {path: 'user.lastname', alias: 'lastname'},
            {path: 'user.phoneNumber', alias: 'phoneNumber'},
            {path: 'car.title', alias: 'carTitle'},
            {path: 'orderStatusValue.title', alias: 'orderStatusTitle'},
        ];
        return this.helperService.actionResult(
            await super.getRows<OrdersDto>(getRows, (query, alias) => {
                query
                    .innerJoin(`${alias}.user`, 'user')
                    .innerJoin(`${alias}.car`, 'car')
                    .innerJoin(PropertyValueEntity, 'orderStatusValue', `orderStatusValue.serialNumber = ${alias}.orderStatus`)

                    .addSelect(['user.firstname', 'orderStatusValue.title',
                        'user.phoneNumber', 'user.lastname', 'car.title'
                    ]);
            }, 'orders'),
            MessageConst.GLOBAL.GET_ROWS,
            false,
            EN_Status.success
        );
    }
}
