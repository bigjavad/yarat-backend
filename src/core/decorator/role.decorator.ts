import { SetMetadata } from '@nestjs/common';
import {EN_RoleEnum} from "../enum/form/EN_Role.enum";

export const ROLES_KEY = 'role';
export const Role = (...role: EN_RoleEnum[]) => SetMetadata(ROLES_KEY, role);
