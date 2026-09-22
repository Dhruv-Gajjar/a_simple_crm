import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClientModule } from './modules/client/client.module';
import { ProjectModule } from './modules/project/project.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { NoteModule } from './modules/note/note.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig =
          configService.getOrThrow<TypeOrmModuleOptions>('database');

        if (!dbConfig) {
          throw new Error('Database configuration could not be loaded.');
        }

        return dbConfig;
      },
      inject: [ConfigService],
    }),
    ClientModule,
    ProjectModule,
    TransactionModule,
    NoteModule,
    DashboardModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
