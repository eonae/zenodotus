import { ExpressAdapter } from '@nestjs/platform-express';
import { PlatformApp } from '@rsdk/core';
import { HttpTransport } from '@rsdk/http-server';

import { AppModule } from './app.module';

export const app = new PlatformApp({
  modules: [AppModule],
  transports: [new HttpTransport(new ExpressAdapter())],
});
