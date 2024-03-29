import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonConfigService } from './modules/shared/common-config/common-config.service';
import { providers } from './app.provider';
import { ApiModule } from './modules/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: CommonConfigService) => ({
        uri: configService.dbConfig.uri,
        //check connection
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('The connection to mongo db is successful');
          });
          connection._events.connected();
          return connection;
        },
      }),
      inject: [CommonConfigService],
    }),
    SharedModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [...providers],
})
export class AppModule {}
