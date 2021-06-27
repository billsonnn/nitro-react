import { ConditionDefinition, TriggerDefinition, WiredActionDefinition } from 'nitro-renderer';

export class WiredFurniSelectorViewProps
{}

export class WiredLayoutViewProps
{
    wiredDefinition: TriggerDefinition | WiredActionDefinition | ConditionDefinition;
}
