import { Transformer } from '@libs/core';

export class UserDetailTransformer extends Transformer {
  availableIncludes = ['extra', 'address', 'pin'];
  defaultIncludes = ['pin'];

  async transform(user: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async includeExtra(user: Record<string, any>): Promise<Record<string, any>> {
    return { username: user.username };
  }

  async includeAddress(
    user: Record<string, any>,
  ): Promise<Record<string, any>> {
    return { country: 'INDIA', cityName: 'Gurugram' };
  }

  async includePin(user: Record<string, any>): Promise<Record<string, any>> {
    return { code: '122002' };
  }
}
