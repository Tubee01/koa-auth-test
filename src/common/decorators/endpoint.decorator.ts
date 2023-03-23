import { Route } from '@common/router';
import { HttpMethodEnum } from 'koa-body';
import { normalizePath } from './utils';

export const Endpoint =
  (method: HttpMethodEnum, path = '') =>
  (target: any, key: string) => {
    target.routes = (target.routes || []) as Route[];

    const normalizedPath = normalizePath(path);

    target.routes.push({
      method,
      path: normalizedPath ? `${normalizedPath}` : '/',
      handler: Object.getOwnPropertyDescriptor(target, key).value,
    }) satisfies Route;
  };
