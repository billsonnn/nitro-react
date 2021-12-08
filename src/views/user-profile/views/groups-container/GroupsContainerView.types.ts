import { HabboGroupEntryData } from '@nitrots/nitro-renderer';

export interface GroupsContainerViewProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
    onLeaveGroup: () => void;
}
