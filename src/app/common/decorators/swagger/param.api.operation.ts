import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

const ParamApiOperation = (controllerName: string): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: `Get ${controllerName} by params`,
      description: `If parameters are not specified, all ${controllerName} will be returned`,
    }),
  );
};

export default ParamApiOperation;
