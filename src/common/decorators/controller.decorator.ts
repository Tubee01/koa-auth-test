import { Route } from '@common/router';
import { normalizePath } from './utils';

export const Controller =
  (path = '') =>
  (target: any) => {
    target.prototype.routes?.forEach((route: Route) => {
      const normalizedPath = normalizePath(path);
      const normalizedRoutePath = normalizePath(route.path);
      route.path = normalizedRoutePath ? `${normalizedPath}/${normalizedRoutePath}` : `/${normalizedPath}`;
    });
  };
