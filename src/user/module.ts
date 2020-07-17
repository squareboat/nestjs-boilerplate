import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models';
import { UserService } from './services';
import { USER_REPOSITORY } from './constants';
import { UserRepository } from './repositories';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class UserModule {}
