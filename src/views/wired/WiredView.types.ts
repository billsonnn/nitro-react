import { ConditionDefinition, TriggerDefinition, WiredActionDefinition } from 'nitro-renderer';

export class WiredFurniSelectorViewProps
{}

export class WiredLayoutViewProps
{
    wiredDefinition: TriggerDefinition | WiredActionDefinition | ConditionDefinition;
}

export class WiredFurniType
{
    public static _Str_5431: number = 0;
    public static _Str_4873: number = 1;
    public static _Str_4991: number = 2;
    public static _Str_5430: number = 3;
}

export const WIRED_STRING_DELIMETER: string = '\t';
