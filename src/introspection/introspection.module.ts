import { Module } from '@nestjs/common';
import { PlatformConfigModule } from '@rsdk/core';

import { AppConfig } from '../app.config';

import { HealthchecksService, IntrospectionService } from './services';

@Module({
  imports: [PlatformConfigModule.forFeature(AppConfig)],
  providers: [HealthchecksService, IntrospectionService],
  exports: [IntrospectionService],
})
export class IntrospectionModule {}
