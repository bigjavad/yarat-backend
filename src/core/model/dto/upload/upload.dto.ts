import {IsNotEmpty, IsString} from "class-validator";

export class UploadDto {
    @IsNotEmpty()
    @IsString()
    data:string;
    @IsNotEmpty()
    @IsString()
    path:string;

}
