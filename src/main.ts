import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as passport from "passport"
import * as session from 'express-session';
import * as path from "path";
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    app.use(
        session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {maxAge: 3600000},
        }),
    );

    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
        credentials: false
    });

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT);
}

bootstrap();
