import { Context, HttpError, Next } from 'koa';

export function errorHandler(): (ctx: Context, next: Next) => Promise<void> {
  return async (ctx: Context, next: Next): Promise<void> => {
    const { logger } = ctx;

    try {
      await next();
    } catch (err) {
      if (err instanceof HttpError) {
        ctx.status = err.status;
        ctx.body = {
          status: -1,
          message: err.message || 'Bad Request',
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          status: -1,
          message: err.message || 'Internal Server Error',
        };
      }

      const { message, stack } = err;

      logger.error(JSON.stringify({ message, stack }), 'Global Error Handler');
    }
  };
}
