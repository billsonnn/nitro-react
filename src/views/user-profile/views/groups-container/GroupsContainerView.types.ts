import { GroupDataParser } from '@nitrots/nitro-renderer';

export interface GroupsContainerViewProps
{
    itsMe: boolean;
    groups: GroupDataParser[];
    onLeaveGroup: () => void;
}
