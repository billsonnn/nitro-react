import { GroupDataParser } from '@nitrots/nitro-renderer';

export interface GroupInformationViewProps
{
    group: GroupDataParser;
    onLeaveGroup?: () => void;
}
