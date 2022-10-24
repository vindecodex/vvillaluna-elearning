import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/*
 * Built to remove responsibility of input validation from service layer
 * Example for: Password verfication or confirm email
 *
 * Guide on creating custom decorators:
 * https://github.com/typestack/class-validator#custom-validation-decorators
 *
 * Ideas helps to solve the issue of checking equality of two fields:
 * https://github.com/typestack/class-validator/issues/486#issuecomment-606767275
 */
export const IsEqualTo =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} and ${args.property} don't match`;
        },
      },
    });
  };
