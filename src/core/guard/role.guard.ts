import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from '../decorator/role.decorator';
import { EN_RoleEnum } from '../enum/form/EN_Role.enum';
import { EN_ExceptionMessage } from "../enum/base/EN_ExceptionMessage";
import { UserService } from "../../form/user/user.service";

@Injectable()
export class
RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles:EN_RoleEnum[] = this.reflector.getAllAndOverride<EN_RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new ForbiddenException(EN_ExceptionMessage.AUTH_VALID_TOKEN_NOT_SENT);
        }

        const token = authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, 'secret') as { sub: any };

            if (!decoded.sub || isNaN(Number(decoded.sub))) {
                throw new ForbiddenException(EN_ExceptionMessage.AUTH_TOKEN_NOT_VALID_HAS_EXPIRED);
            }

            const userId = Number(decoded.sub);
            const user = await this.usersService.fineById(userId);

            if (!user.data) {
                throw new ForbiddenException(EN_ExceptionMessage.AUTH_TOKEN_NOT_VALID_HAS_EXPIRED);
            }

            if (!user.data.role || !requiredRoles.includes(user.data.role)) {
                throw new ForbiddenException(EN_ExceptionMessage.AUTH_NOT_ALLOWED_CALL_SERVICE);
            }

            request.user = user.data;
            return true;
        } catch (err) {
            if (err instanceof ForbiddenException) {
                throw err;
            }
            throw new ForbiddenException(EN_ExceptionMessage.AUTH_TOKEN_NOT_VALID_HAS_EXPIRED);
        }
    }
}
