import {Entity, Column} from "typeorm"
import {BaseEntityModel} from "../../core/entity/base-entity-model";


@Entity("user-otp")
export class UserOtpEntity extends BaseEntityModel {
    @Column({ unique: false,nullable:false})
    phoneNumber: string;

    @Column()
    code: string;

    @Column({ default: false })
    isUsed: boolean;
}
