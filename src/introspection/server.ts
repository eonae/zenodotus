import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { Convert } from '@rsdk/common';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { print } from 'graphql';
import { createServer } from 'node:http';

import type { ErrorDefinition } from './errors';
import { ERRORS } from './errors';

const fail = (reason: ErrorDefinition, err?: unknown): void => {
  const [code, msg] = reason;

  console.log(msg);
  if (err) {
    console.log(err);
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code);
};

const getArgs = (): { port: number; schemasGlob: string } => {
  let port = 0;

  try {
    port = Convert.int(process.argv[2]);
  } catch (error) {
    fail(ERRORS.INVALID_PORT, error);
  }

  const schemasGlob = process.argv[3];

  if (typeof schemasGlob !== 'string') {
    fail(ERRORS.INVALID_GLOB);
  }

  return { port, schemasGlob };
};

const readTypeDefs = (glob: string): string => {
  const typesArray = loadFilesSync(glob);

  const mergedSchema = mergeTypeDefs(typesArray);

  return print(mergedSchema);
};

const log = (msg: string): void => {
  console.log(`[INTROSPECTION SERVER]: ${msg}`);
};

const bootstrap = async (): Promise<void> => {
  const { port, schemasGlob } = getArgs();

  const app = express();
  const httpServer = createServer(app);
  let apollo: ApolloServer;

  try {
    apollo = new ApolloServer({
      typeDefs: readTypeDefs(schemasGlob),
      resolvers: {},
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
  } catch (error) {
    return fail(ERRORS.INVALID_SCHEMA, error);
  }

  try {
    await apollo.start();
  } catch (error) {
    return fail(ERRORS.APOLLO_ERROR, error);
  }

  app.get('/health', (_, res) => {
    res.status(200);
    res.send('OK');
  });

  app.use('/', cors(), json(), expressMiddleware(apollo));

  httpServer.on('error', (err) => {
    fail(ERRORS.SERVER_ERROR, err);
  });

  log(`starting on port ${port}...`);
  log(`pid: ${process.pid}`);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port }, () => {
      log(`Success! Serving...`);
      resolve();
    }),
  );
};

bootstrap();
