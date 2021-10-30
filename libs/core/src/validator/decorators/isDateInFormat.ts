import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ async: true })
class IsDateInFormatConstraint implements ValidatorConstraintInterface {
  async validate(value: any | Array<any>, args: ValidationArguments) {
    const [format] = args.constraints;
    return moment(value, format, true).isValid();
  }

  defaultMessage(args: ValidationArguments) {
    const property = args.property;
    const [format] = args.constraints;
    return `${property} should be in ${format} format.`;
  }
}

export function IsDateInFormat(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [format],
      validator: IsDateInFormatConstraint,
    });
  };
}
