import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsLessThanConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    let returnValue = true;
    for (let i = 0; i < args.constraints.length; i++) {
      if (value > (args.object as any)[args.constraints[i]]) {
        returnValue = false;
      }
    }
    return returnValue;
  }

  defaultMessage(args: ValidationArguments) {
    const property = args.property;
    return `${property} should be less than ${args.constraints.join(',')}`;
  }
}

export function IsLessThanProp(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: property,
      validator: IsLessThanConstraint,
    });
  };
}
