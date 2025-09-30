import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentHeader = createParamDecorator(
  (headerName: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.headers[headerName.toLowerCase()];
  },
);
