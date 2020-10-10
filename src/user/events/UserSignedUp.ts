import { EmitsEvent, Event } from '@app/core/events';

@Event('USER_SIGNED_UP')
export class UserSignedUp extends EmitsEvent {}
