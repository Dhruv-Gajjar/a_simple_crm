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
        try {
          const dataSource: TypeOrmModuleOptions = {
            type: 'postgres',
            host: configService.getOrThrow('DB_HOST'),
            port: configService.getOrThrow('DB_PORT'),
            username: configService.getOrThrow('DB_USERNAME'),
            password: configService.getOrThrow('DB_PASSWORD'),
            database: configService.getOrThrow('DB_NAME'),
            synchronize: true,
            migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
            logging: configService.getOrThrow('DB_LOGGING') == 'true',
            entities: [],
            autoLoadEntities: true,
          };
          console.log('Connected to DB.!');
          return dataSource;
        } catch (error) {
          console.log(`ERROR: DB connection error - ${error as Error}`);
          throw error;
        }
      },
      inject: [ConfigService],
    }),
    ClientModule,
    ProjectModule,
    TransactionModule,
    NoteModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
