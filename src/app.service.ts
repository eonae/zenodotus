import { Injectable } from '@nestjs/common';
import { InjectLogger } from '@rsdk/core';
import { ILogger } from '@rsdk/logging';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import type { SimpleGit } from 'simple-git';
import createClient from 'simple-git';

import { AppConfig } from './app.config';
import { WORKDIR } from './constants';
import { IntrospectionService } from './introspection';

@Injectable()
export class AppService {
  private readonly dir = path.join(WORKDIR, 'contract');
  private currentRef: string | null = null;
  private isReloading = false;

  constructor(
    @InjectLogger(AppService) private readonly logger: ILogger,
    private readonly introspection: IntrospectionService,
    private readonly config: AppConfig,
  ) {}

  async reload(ref = 'master'): Promise<void> {
    if (this.isReloading) {
      this.logger.info('Is already reloading - skip...');
      return;
    }

    if (this.currentRef === ref) {
      this.logger.info(`No need to reload - already on ref ${ref}`);
      return;
    }

    this.logger.info(`Reloading ref ${ref} ...`);
    this.isReloading = true;
    this.currentRef = ref;

    await this.fetch(ref);
    await this.introspection.restart();

    this.isReloading = false;
  }

  private async fetch(ref: string): Promise<void> {
    const { binary, repositoryUrl } = this.config;
    const git: SimpleGit = createClient({ binary });

    this.logger.info(`Preparing workdir: ${this.dir} ...`);
    await rm(this.dir, { force: true, recursive: true });
    await mkdir(this.dir);

    this.logger.info(`Fetching repository: ${repositoryUrl.pathname} ...`);
    await git.clone(repositoryUrl.toString(), this.dir);

    this.logger.info(`Checking out ${ref} ...`);
    await git.cwd(this.dir).checkout(ref);

    this.logger.info('✅ Done!');
  }
}
