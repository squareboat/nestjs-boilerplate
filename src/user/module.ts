import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { USER_REPOSITORY } from './constants';
import { UserRepository } from './repositories';

@Module({
  imports: [HttpModule,],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class UserModule { }
