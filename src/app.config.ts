import { text } from '@rsdk/common';
import {
  BoolParser,
  Config,
  ConfigSection,
  IntParser,
  Property,
  StringParser,
  UrlParser,
} from '@rsdk/core';

@ConfigSection()
export class AppConfig extends Config {
  @Property('CONTRACT_URL', new UrlParser(), {
    description: text`
      Url to git repository. Use HTTP url with basic credentials.
      Ex: https://mylogin:mytoken@git.mycompany.com/repo.git
    `,
  })
  repositoryUrl!: URL;

  @Property('INTROSPECTION_EXTERNAL_URL', new UrlParser(), {
    description: text`
      Url that will be used by frontend to get introspection.
    `,
  })
  introspectionExternalUrl!: URL;

  @Property('INTROSPECTION_INTERNAL_PORT', new IntParser(), {
    description: text`
      Port that will be used for introspection internally inside
      of container. 
    `,
  })
  instrospectionInternalPort!: number;

  @Property('SCHEMAS_GLOB', new StringParser(), {
    description: 'Glob pattern for schemas in contract repositories',
  })
  schemasGlob!: string;

  @Property('GIT_BINARY', new StringParser(), {
    description: 'Path to git client binary',
    defaultValue: 'git',
  })
  binary!: string;

  @Property('INHERIT_STDOUT', new BoolParser(), {
    defaultValue: false,
    description: text`
      If true, that logs from introspection server
      will go to master process console
    `,
  })
  inheritStdout!: boolean;
}
