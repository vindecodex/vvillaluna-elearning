import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  Type,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../authorization/factories/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../../authorization/interfaces/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<Type<PolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const ability = this.caslAbilityFactory.createForUser(user);

    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(request, contextId);

    const handlers: PolicyHandler[] = [];

    for (const handler of policyHandlers) {
      const policyScope = this.moduleRef.introspect(handler).scope;
      let policyHandler: PolicyHandler;
      if (policyScope === Scope.DEFAULT) {
        policyHandler = this.moduleRef.get(handler, { strict: false });
      } else {
        policyHandler = await this.moduleRef.resolve(handler, contextId, {
          strict: false,
        });
      }
      handlers.push(policyHandler);
    }

    return handlers.every((handler) => handler.handle(ability));
  }
}
