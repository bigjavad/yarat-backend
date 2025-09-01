import {BeforeInsert, BeforeUpdate, Column, Entity} from "typeorm";
import {BasePopularModel} from "../../core/entity/base-popular-model";
import {CreatorSlug} from "../../core/utility/creator-slug";
import {EN_CategoryStatusEnum} from "../../core/enum/form/EN_CategoryStatus.enum";

@Entity("category-menu")
export class CategoryMenuEntity extends BasePopularModel{
    @Column({nullable: false})
    title: string;
    @Column({ unique: true })
    slug: string;
    @Column()
    link: string;
    @Column({nullable: true})
    icon: string;
    @Column({nullable: true})
    image: string;
    @Column({nullable: true})
    color: string;

    @Column({
        type: 'enum',
        enum: EN_CategoryStatusEnum,
        default: EN_CategoryStatusEnum.CATEGORY_STATUS_ACTIVE,
        nullable: false
    })
    categoryStatus: EN_CategoryStatusEnum;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slug = CreatorSlug([this.title]);
    }

}
