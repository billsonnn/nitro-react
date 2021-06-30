import { ConditionDefinition, Triggerable, TriggerDefinition, WiredActionDefinition } from 'nitro-renderer';
import { GetWiredActionLayout } from './GetWiredActionLayout';
import { GetWiredConditionLayout } from './GetWiredConditionLayout';
import { GetWiredTriggerLayout } from './GetWiredTriggerLayout';

export function GetWiredLayout(trigger: Triggerable): JSX.Element
{
    if(trigger instanceof WiredActionDefinition) return GetWiredActionLayout(trigger.code);

    if(trigger instanceof TriggerDefinition) return GetWiredTriggerLayout(trigger.code);
    
    if(trigger instanceof ConditionDefinition) return GetWiredConditionLayout(trigger.code);
    
    return null;
}
