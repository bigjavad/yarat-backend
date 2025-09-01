import {Column} from "typeorm";
import {BaseEntityModel} from "./base-entity-model";

export class BasePopularModel extends BaseEntityModel{

    @Column({ type: 'int', default: 0 })
    viewer: number;

    @Column({ type: 'int', default: 0 })
    like: number;
    incrementViewer() {
        this.viewer += 1;
    }
    incrementLike() {
        this.like += 1;
    }
    decrementLike() {
        if (this.like > 0) {
            this.like -= 1;
        }
    }

}
