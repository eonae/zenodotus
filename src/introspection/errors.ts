import { text } from '@rsdk/common';

export type ErrorDefinition = [number, string];
export const ERRORS: Record<string, ErrorDefinition> = {
  INVALID_PORT: [
    400,
    'You should provide correct port number as first cli argument!',
  ],
  INVALID_GLOB: [
    401,
    text`
      You should provide correct glob for SDL files as second cli argument!
      Don't forget to wrap it into quotes.
    `,
  ],
  INVALID_SCHEMA: [402, 'Something is wrong with your schema'],
  APOLLO_ERROR: [403, 'apollo.start() failed!'],
  SERVER_ERROR: [404, 'server.listen() failed!'],
};
