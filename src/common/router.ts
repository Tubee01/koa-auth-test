import Application, { Context, Next } from 'koa';
import KoaRouter from '@koa/router';
import { HttpMethodEnum } from 'koa-body';

interface ClassConstructor<T> {
  new (app: Application): { routes: Route[] } & T;
}

export type Route = {
  method: HttpMethodEnum;
  path: string;
  handler: {
    name: string;
    [key: string]: any;
  };
};

export class Router<T> {
  private readonly router: KoaRouter = new KoaRouter();

  private readonly controllers: ClassConstructor<T>[] = [];

  constructor(private readonly app: Application, controllers: T[]) {
    this.controllers = controllers as ClassConstructor<T>[];
  }

  public init() {
    const { logger } = this.app.context;

    function controllerCallback<C>(controllerInstance: C, handler: string) {
      return async (ctx: Context, next: Next) => await controllerInstance[handler](ctx, next);
    }

    this.controllers.forEach((controller) => {
      const controllerInstance = new controller(this.app);
      const { routes } = controllerInstance;

      if (!routes || !routes.length) {
        return;
      }

      routes.forEach((route: Route) => {
        const {
          method,
          path,
          handler: { name },
        } = route;

        logger.info(`mapped ${method} ${path}`, this.constructor.name);

        this.router[method.toLowerCase()](path, controllerCallback(controllerInstance, name));
      });
    });

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}
