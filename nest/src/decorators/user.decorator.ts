import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// пример использования кастомного декоратора из Jwt validate
export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
