import { registerAs } from '@nestjs/config';

// all your application settings go here.
export default registerAs('settings', () => ({}));
