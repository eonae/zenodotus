import { Injectable } from '@nestjs/common';
import { InjectLogger } from '@rsdk/core';
import { ILogger } from '@rsdk/logging';
import axios from 'axios';
import { EventEmitter } from 'node:events';

import { AppConfig } from '../../app.config';

@Injectable()
// eslint-disable-next-line unicorn/prefer-event-target
export class HealthchecksService extends EventEmitter {
  private timer: NodeJS.Timer | null = null;

  constructor(
    @InjectLogger(HealthchecksService) private readonly logger: ILogger,
    private readonly config: AppConfig,
  ) {
    super();
  }

  start(): void {
    const url = `http://localhost:${this.config.instrospectionInternalPort}/health`;

    this.logger.info(`Starting introspection server healthchecks...`);
    this.logger.info(`Healthcheck url: ${url}`);

    this.timer = setInterval(async () => {
      try {
        await axios.get(url);
        this.emit('ok');
      } catch {
        this.emit('fail');
      }
    }, 2000);
  }

  stop(): void {
    if (this.timer) {
      this.logger.info(`Stopping introspection server healthchecks...`);
      clearInterval(this.timer);
    }
  }
}
