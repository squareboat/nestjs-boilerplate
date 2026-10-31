import { RestServer } from '@libs/boat';
import { AppModule } from './app';
import { assertAuthSecrets } from './auth/secrets';

// .env is loaded while ./app is imported, so the secrets are set by now
try {
  assertAuthSecrets();
} catch (e) {
  console.error(`Refusing to start: ${(e as Error).message}`);
  process.exit(1);
}

RestServer.make(AppModule, { addValidationContainer: true });
