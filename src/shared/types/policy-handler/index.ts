import { AppAbility } from '../../../authorization/casl-ability.factory';
import { IPolicyHandler } from '../../../authorization/policy-handler/policy-handler.interface';

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
