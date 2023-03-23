import { errorHandler } from '@common/error-handler';
import { Logger } from '@common/logger';
import { Router } from '@common/router';
import { config } from 'dotenv';
import Koa from 'koa';
import koaBody from 'koa-body';
import json from 'koa-json';
import koaLogger from 'koa-logger';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import { AppController } from './modules/app.controller';
import { Auth } from '@common/auth';
import { AuthController } from 'modules/auth/auth.controller';

config();

interface AppConfig {
  readonly NODE_ENV: 'development' | 'production';
  readonly SECRET: string;
  readonly PORT: string;
}

declare module 'koa' {
  interface BaseContext {
    logger: Logger;
    auth: Auth;
    config: AppConfig;
  }
}

const APP_PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  const logger = new Logger();
  const app = new Koa();

  app.context.config = process.env as unknown as AppConfig;

  /*
   * Logger
   */
  app.context.logger = logger;

  /*
   * Swagger
   */
  const spec = yamljs.load('./openapi.yml');
  app.use(
    koaSwagger({
      routePrefix: '/swagger',
      swaggerOptions: {
        spec,
      },
    }),
  );

  /*
   * Middleware
   */
  app.use(koaBody());
  app.use(koaLogger());
  app.use(json());
  app.use(errorHandler());

  new Auth(app);

  /*
   *  Routes
   */
  const routes = [AppController, AuthController];
  new Router(app, routes).init();

  app.listen(APP_PORT).on('listening', () => {
    logger.info(`Server listening on port ${APP_PORT}`, bootstrap.name);
    logger.info(`URL: http://localhost:${APP_PORT}`, bootstrap.name);
    logger.info(`Swagger UI available at http://localhost:${APP_PORT}/swagger`, bootstrap.name);
  });
};

bootstrap();
