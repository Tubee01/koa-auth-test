import { Controller, Get } from '@common/decorators';
import Application, { Context } from 'koa';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(private readonly app: Application) {
    this.appService = new AppService(this.app);
  }

  @Get()
  async findAll(ctx: Context) {
    const objects = await this.appService.findAll();
    ctx.body = objects;
  }

  @Get('random')
  async findRandom(ctx: Context) {
    const object = await this.appService.findRandom();
    ctx.body = object;
  }
}
