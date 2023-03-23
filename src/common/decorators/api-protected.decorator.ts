import { authenticate } from '@common/auth';

export const ApiProtected = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = Object.getOwnPropertyDescriptor(target, key).value;

    descriptor.value = async function (...args: any[]) {
      const ctx = args[0];
      await authenticate(ctx, () => {
        return originalMethod.apply(this, args);
      });
    };
  };
};
