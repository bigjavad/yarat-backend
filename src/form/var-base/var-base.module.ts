import {Module} from '@nestjs/common';
import {VarBaseService} from './var-base.service';
import {VarBaseController} from './var-base.controller';
import {HelperService} from "../../core/service/helper.service";

@Module({
    controllers: [VarBaseController],
    providers: [VarBaseService,HelperService],
    exports: [VarBaseService],
})
export class VarBaseModule {
}
