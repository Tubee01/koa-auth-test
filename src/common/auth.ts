import Application, { Context } from 'koa';
import session from 'koa-session';
import passport from 'koa-passport';
import { Logger } from '@common/logger';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

export const authenticate = (ctx: Context, next: () => Promise<any>) => {
  if (ctx.isAuthenticated()) {
    return next();
  }

  ctx.status = 401;
  ctx.body = { message: 'Unauthorized' };
};

export const authorize = (role: string) => {
  return (ctx: Context, next: () => Promise<any>) => {
    if (ctx.isAuthenticated() && ctx.state.user.role === role) {
      return next();
    }

    ctx.status = 403;
    ctx.body = { message: 'Forbidden' };
  };
};

export class Auth {
  private readonly logger: Logger;

  constructor(private readonly app: Application) {
    this.logger = this.app.context.logger;

    app.keys = [this.app.context.config.SECRET];

    if (!app.keys.filter(Boolean).length) {
      throw new Error('Secret key is not set');
    }

    app.use(session(app));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
    passport.use(new LocalStrategy(this.localStrategy));

    this.logger.info('Initialized', this.constructor.name);
  }

  private readonly localStrategy = async (username: string, password: string, done: any) => {
    const user = await this.getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: 'Invalid username' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, user);
  };

  private serializeUser = (user: any, done: any) => {
    done(null, user);
  };

  private deserializeUser = (user: any, done: any) => {
    done(null, user);
  };

  private getUserByUsername = async (name: string) => {
    return {
      id: 1,
      name,
      password: await bcrypt.hash(name),
    };
  };
}
