import { Module, Global } from '@nestjs/common';
import { BaseValidator } from './validator';
import { getProviders } from './providers';

@Global()
@Module({
  imports: [],
  providers: getProviders(),
  exports: [BaseValidator],
})
export class CoreModule {}
