import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { USER_REPOSITORY } from './constants';
import { UserRepository } from './repositories';
import { CreateUser } from './commands';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUser,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class UserModule {}
