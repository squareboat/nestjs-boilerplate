import { Module } from '@nestjs/common';
import { EventModule } from '@squareboat/nest-events';
import { UserModule } from './user';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { LocalizationModule } from '@squareboat/nestjs-localization';

@Module({
  imports: [
    LocalizationModule.register({
      path: 'resources/lang',
      fallbackLang: 'en',
    }),
		BoatModule,
    UserModule,
    EventModule,
    ConsoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
