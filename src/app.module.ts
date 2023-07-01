import { Module } from '@nestjs/common';
import { PlatformConfigModule } from '@rsdk/core';

import { AppConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntrospectionModule } from './introspection';

@Module({
  imports: [PlatformConfigModule.forFeature(AppConfig), IntrospectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
