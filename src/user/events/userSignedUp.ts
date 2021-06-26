import { Event, EmitsEvent } from '@squareboat/nest-events';

@Event('USER_SIGNED_UP')
export class UserSignedUp extends EmitsEvent {}
