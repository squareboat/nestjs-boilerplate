import { Transformer } from '@app/core';

export class UserDetailTransformer extends Transformer {
    availableIncludes = ['extra',];

    async transform(user: Record<string, any>): Promise<Record<string, any>> {
        return {
            id: user.uuid,
            firstName: user.firstName,
            lastName: user.lastName
        };
    }

    async includeExtra(user: Record<string, any>): Promise<Record<string, any>> {
        return this.primitive({
            username: user.username,
            address: 'INDIA',
        })
    }
}
