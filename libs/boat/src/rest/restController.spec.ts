import { Controller, Get, INestApplication, Req, Res } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Transformer } from '../transformers/transformer';
import { RequestGuard } from './guards';
import type { Request, Response } from './interfaces';
import { RestController } from './restController';

class ItemTransformer extends Transformer {
  availableIncludes = ['owner'];
  defaultIncludes = [];

  async transform(item: Record<string, any>): Promise<Record<string, any>> {
    return { id: item.id, title: item.title };
  }

  async includeOwner(item: Record<string, any>): Promise<Record<string, any>> {
    return { name: item.owner };
  }
}

@Controller('items')
class ItemController extends RestController {
  @Get()
  async index(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const items = [{ id: 1, title: 'First', owner: 'Jane' }];
    return res.success(
      await this.collection(items, new ItemTransformer(), { req }),
    );
  }
}

describe('RestController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ItemController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalGuards(new RequestGuard());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('wraps the transformed data with res.success()', async () => {
    await request(app.getHttpServer())
      .get('/items')
      .expect(200)
      .expect({ success: true, code: 200, data: [{ id: 1, title: 'First' }] });
  });

  it('applies includes from the query string', async () => {
    await request(app.getHttpServer())
      .get('/items?include=owner')
      .expect(200)
      .expect({
        success: true,
        code: 200,
        data: [{ id: 1, title: 'First', owner: { name: 'Jane' } }],
      });
  });
});
