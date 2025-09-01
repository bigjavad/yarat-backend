import {IsString, IsNotEmpty, IsNumber} from 'class-validator';
import {BasePopularModel} from "../../../entity/base-popular-model";

export class PostCommentDto extends BasePopularModel{
    @IsNumber()
    @IsNotEmpty()
    postId: number;

    @IsNumber()
    parentCommentId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
