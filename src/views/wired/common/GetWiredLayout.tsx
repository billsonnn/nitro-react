import { Triggerable, WiredActionDefinition } from 'nitro-renderer';
import { GetWiredActionLayout } from './GetWiredActionLayout';

export function GetWiredLayout(trigger: Triggerable): JSX.Element
{
    if(trigger instanceof WiredActionDefinition) return GetWiredActionLayout(trigger.code);

    return null;
}
