import { Injectable } from '@nestjs/common';
import { text } from '@rsdk/common';
import { InjectLogger } from '@rsdk/core';
import { ILogger } from '@rsdk/logging';
import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

import { AppConfig } from '../../app.config';
import { WORKDIR } from '../../constants';

import { HealthchecksService } from './healthchecks.service';

@Injectable()
export class IntrospectionService {
  private cp: ChildProcess | null = null;

  constructor(
    @InjectLogger(IntrospectionService) private readonly logger: ILogger,
    private readonly healthchecks: HealthchecksService,
    private readonly config: AppConfig,
  ) {}

  onModuleDestroy(): void {
    this.stop();
  }

  async restart(): Promise<void> {
    this.stop();
    await this.start();
  }

  private start(): Promise<void> {
    if (this.cp) {
      throw new Error(text`
        Can't start introspection server. Because it is already
        started!
      `);
    }

    this.logger.info('Starting introspection server...');

    const args = [
      this.config.instrospectionInternalPort.toString(),
      join(WORKDIR, 'contract', this.config.schemasGlob),
    ];

    return new Promise((resolve, reject) => {
      this.cp = spawn('node', ['dist/introspection/server.js', ...args], {
        stdio: this.config.inheritStdout ? 'inherit' : 'ignore',
      });

      this.healthchecks.once('ok', () => {
        this.logger.info('Introspection server is up! 🚀');
        resolve();
      });

      let fails = 0;

      const failHandler = (): void => {
        fails++;
        if (fails > 5) {
          this.healthchecks.off('fail', failHandler);
          this.stop();
          reject(new Error('introspection server timeout'));
        }
      };

      this.cp.on('error', (error) => {
        this.healthchecks.off('fail', failHandler);
        this.logger.error(``, error);
        this.stop();
      });

      this.healthchecks.on('fail', failHandler);
      this.healthchecks.start();
    });
  }

  private stop(): void {
    this.logger.info('Stopping introspection server');

    this.healthchecks.stop();
    this.cp?.kill();
    this.cp = null;
  }
}
