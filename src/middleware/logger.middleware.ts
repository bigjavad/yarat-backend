import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from "express";
import {LoggerService} from "../form/logger/logger.service";
import {LoggerDto} from "../core/model/dto/logger/logger.dto";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        private readonly loggerService: LoggerService
    ) {
    }

    use(req: Request, res: Response, next: (error?: any) => void) {
        let model:LoggerDto=new LoggerDto();
        model.ip = req.ip;
        model.method = req.method;
        model.baseUrl = req.baseUrl;
        model.userAgent = req.get('user-agent') || '';
        const startAt = process.hrtime();
        res.on('finish' , ()=>{
          model.statusCode= res.statusCode;
          model.contentLength = res.get('content-length');
          const dif = process.hrtime(startAt);
          model.responseTime = (dif[0] * 1e3 + dif[1] * 1e-6).toFixed(2);
          return this.loggerService.save(model);
        })
        next();
    }
}
