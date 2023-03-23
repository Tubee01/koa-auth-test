import { Endpoint } from './endpoint.decorator';

export * from './controller.decorator';

import { HttpMethodEnum } from 'koa-body';

export const Get = (path = '') => {
  return Endpoint(HttpMethodEnum.GET, path);
};

export const Post = (path = '') => {
  return Endpoint(HttpMethodEnum.POST, path);
};

export const Put = (path = '') => {
  return Endpoint(HttpMethodEnum.PUT, path);
};

export const Delete = (path = '') => {
  return Endpoint(HttpMethodEnum.DELETE, path);
};

export const Patch = (path = '') => {
  return Endpoint(HttpMethodEnum.PATCH, path);
};
