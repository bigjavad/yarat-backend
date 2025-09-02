import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from "./form/form.module";
import { JwtStrategies } from "./core/strategies/jwt.strategies";
import { RoleGuard } from "./core/guard/role.guard";
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import { LoggerEntity } from "./entity/logger/logger.entity";
import { LoggerModule } from "./form/logger/logger.module";
import { UserModule } from "./form/user/user.module";
import {ConfigModule} from "@nestjs/config";
import {BaseActionInterceptor} from "./interceptor/base-action.interceptor";

@Module({
    imports: [
        UserModule,

        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true,
        }),
        FormModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
        LoggerModule,
        TypeOrmModule.forFeature([LoggerEntity]),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: BaseActionInterceptor
        },
        AppService,
        JwtStrategies,
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }

}
