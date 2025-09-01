import { SetMetadata } from '@nestjs/common';

export const SetDisableActionInterceptor = (disableActionInterceptor: boolean=false) => SetMetadata('disableActionInterceptor', disableActionInterceptor);
