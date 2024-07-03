import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

const QueryApiOperation = (
  param: string,
  type?: string,
  description?: string,
): MethodDecorator => {
  return applyDecorators(
    ApiQuery({
      name: param,
      type: type,
      description: description,
      required: false,
    }),
  );
};

export default QueryApiOperation;
