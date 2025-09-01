import {CallHandler, ExecutionContext, Injectable, NestInterceptor,} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {EN_TargetActionEnum} from "../core/enum/base/EN_TargetAction.enum";

@Injectable()
export class BaseActionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        const now = new Date();
        const target = Reflect.getMetadata('actionTarget', context.getHandler());
        const disableActionInterceptor = Reflect.getMetadata('disableActionInterceptor', context.getHandler());
        if (disableActionInterceptor){
           return next.handle();
        }
        if (request.body && request.method === 'POST') {
            const url = request.url;

            if (url.includes('save') || target === EN_TargetActionEnum.SAVE) {
                this.setCreationFields(request, user, now);
            }
            else if (url.includes('update') || target === EN_TargetActionEnum.UPDATE) {
                this.setUpdateFields(request, user, now);
            }
        }

        return next.handle();
    }

    private setCreationFields(request: Request, user: any, now: Date) {
        request.body.creatorId = user?.id;
        request.body.createdBy = user?.username || 'system';
        request.body.createdAt = now;
    }

    private setUpdateFields(request: Request, user: any, now: Date) {
        request.body.updaterId = user?.userId;
        request.body.updatedBy = user?.username || 'system';
        request.body.updatedAt = now;
    }

}
