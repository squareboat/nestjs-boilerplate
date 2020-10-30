import { Transformer } from '@app/core';

export class UserDetailTransformer extends Transformer {
  availableIncludes = [
    'extra',
    'address.extra',
    'extra.[address,extra]',
    'address.extra.[address,extra]',
    'extra.address.[address,extra,pin]',
    'extra.address.[extra,address.pin]',
  ];

  async transform(user: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async includeExtra(user: Record<string, any>): Promise<Record<string, any>> {
    return this.primitive({
      username: user.username,
    });
  }

  async includeAddress(
    user: Record<string, any>,
  ): Promise<Record<string, any>> {
    return this.primitive({
      country: 'INDIA',
      cityName: 'Delhi',
    });
  }
  async includePin(user: Record<string, any>): Promise<Record<string, any>> {
    return this.primitive({
      code: '110010',
    });
  }
}
