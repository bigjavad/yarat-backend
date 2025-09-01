import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import { PostService } from './post.service';
import {REST_CONST} from "../../core/const/rest.const";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import { ParseQueryPipe } from 'src/core/pipe/parse-query.pipe';
import {PostEntity} from "../../entity/post/post.entity";
import {PostDto} from "../../core/model/dto/post/post.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {GetRows} from "../../core/model/base/get-rows";
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {CityDto} from "../../core/model/dto/city/city.dto";


@Controller(CONTROLLER_CONST.POST)
export class PostController {
  constructor(private readonly  postService: PostService) {}

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.SAVE)
  save(@Body() postDto: PostDto):Promise<ActionResult<PostEntity>>{
    return this.postService.savePost(postDto)
  }

  @Get(REST_CONST.GLOBAL.GET_ROWS)
  getRowsUser(@Query(new ParseQueryPipe()) query: GetRows<PostDto, PostEntity[]>):Promise<ActionResult<GetRows<PostDto,PostEntity[]>>>{
    return this.postService.getRowsPost(query);
  }

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.GET_ROWS)
  getRowsAdmin(@Body() getList: GetRows<PostDto, PostEntity[]>): Promise<ActionResult<GetRows<PostDto, PostEntity[]>>> {
    return this.postService.getRowsPost(getList);
  }

  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.REMOVE)
  remove (@Body() id: number):Promise<ActionResult<PostEntity>> {
    return this.postService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.GLOBAL.UPDATE)
  update(@Body() postDto: PostDto): Promise<ActionResult<PostDto>> {
    return this.postService.updatePost(postDto);
  }

  @Get(':slug')
  getBySlug(@Param('slug')slug:string):Promise<ActionResult<PostEntity>>{
    return this.postService.getBySlug(slug)
  }


  @UseGuards(RoleGuard)
  @Role(EN_RoleEnum.ADMIN)
  @Post(REST_CONST.POST.GET_COUNT_WITH_STATUS)
  getCountWithStatus (@Body() postDto: PostDto):Promise<ActionResult<number>> {
    return this.postService.getCountWithStatus(postDto);
  }

}
