import { readFile } from 'fs/promises';

import { AppConfig } from './app.config';
import { AppService } from './app.service';
import { DEFAULT_REF } from './constants';

import { Controller, Get, Header, Query } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly service: AppService,
    private readonly config: AppConfig,
  ) {}

  @Get('/favicon.ico')
  @Header('Content-Type', 'application/png')
  favicon(): Promise<Buffer> {
    return readFile('./favicon.png');
  }

  @Get('/')
  @Header('Content-Type', 'text/html')
  async get(@Query('ref') ref: string): Promise<string> {
    await this.service.reload(ref || DEFAULT_REF);

    return /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js"></script>
    
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/graphql-voyager@1.0.0-rc.31/dist/voyager.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/graphql-voyager@1.0.0-rc.31/dist/voyager.min.js"></script>
      </head>
      <body>
        <div id="voyager">Loading...</div>
        <script>
          const introspectionProvider = (query) => fetch('${this.config.introspectionBaseUrl}graphql', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            // ...
          }).then((response) => response.json());
          // or just return pre-fetched introspection
    
          // Render <Voyager />
          GraphQLVoyager.init(document.getElementById('voyager'), {
            introspection: introspectionProvider,
          });
        </script>
      </body>
    </html>
        `;
  }
}
