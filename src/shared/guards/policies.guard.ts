import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../authorization/factories/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { Request } from 'express';
import { PolicyHandler } from '../../authorization/interfaces/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const policyHandlers =
      this.reflector.get<Type<PolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) => {
      const handlerInstance = this.getHandlerInstance(handler, request);
      return handlerInstance.handle(ability);
    });
  }

  private getHandlerInstance(
    handler: Type<PolicyHandler>,
    request: Request,
  ): PolicyHandler {
    return new handler(request);
  }
}
