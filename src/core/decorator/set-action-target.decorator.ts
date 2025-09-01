import { SetMetadata } from '@nestjs/common';
import {EN_TargetActionEnum} from "../enum/base/EN_TargetAction.enum";

export const SetActionTarget = (target: EN_TargetActionEnum) => SetMetadata('actionTarget', target);
