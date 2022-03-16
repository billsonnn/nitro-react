import { GroupFavoriteComposer, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '..';

export const ToggleFavoriteGroup = (group: HabboGroupEntryData) =>
{
    // new GroupUnfavoriteComposer(group.groupId)
    SendMessageComposer(group.favourite ? null : new GroupFavoriteComposer(group.groupId));
}
