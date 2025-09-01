import {Module} from '@nestjs/common';
import {HelperService} from "../../core/service/helper.service";
import {UploadController} from "./upload.controller";
import {UploadService} from "./upload.service";
import {UserModule} from "../user/user.module";
import {ImageService} from "../../core/service/image.service";

@Module({
    controllers: [UploadController],
    providers: [UploadService,ImageService, HelperService],
    imports: [
        UserModule
    ],
})
export class UploadModule {
}
