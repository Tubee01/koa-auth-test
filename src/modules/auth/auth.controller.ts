import { Controller, Post } from '@common/decorators';
import Application, { Context } from 'koa';
import passport from 'koa-passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly app: Application) {}

  @Post('/login')
  public async login(ctx: Context, next: () => Promise<any>) {
    this.app.context.logger.info('login');

    return passport.authenticate('local', (err, user, info) => {
      if (!user || err) {
        ctx.status = 401;
        ctx.body = { message: info.message };
      } else {
        ctx.body = { user };
        return ctx.login(user);
      }
    })(ctx, next);
  }
}
