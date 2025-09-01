import {AnalysisDto} from "../../base/analysis.dto";
import {EN_RoleEnum} from "../../../enum/form/EN_Role.enum";

export class UserCountRoleDto {
    startDate:string;
    data:AnalysisDto[];
    role:EN_RoleEnum;
}
