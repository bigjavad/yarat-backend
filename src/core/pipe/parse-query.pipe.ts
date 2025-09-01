import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (value.sort && typeof value.sort === 'string') {
        value.sort = JSON.parse(value.sort);
      }
      if (value.filter && typeof value.filter === 'string') {
        value.filter = JSON.parse(value.filter);
      }
      if (value.page) {
        value.page = parseInt(value.page, 10);
      }
      if (value.pageSize) {
        value.pageSize = parseInt(value.pageSize, 10);
      }
      return value;
    } catch (error) {
      throw new BadRequestException('Invalid query parameters');
    }
  }
}
