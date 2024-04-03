import { IPartColor } from '@nitrots/nitro-renderer';

export const AvatarEditorColorSorter = (a: IPartColor, b: IPartColor) =>
{
    const clubLevelA = (!a ? -1 : a.clubLevel);
    const clubLevelB = (!b ? -1 : b.clubLevel);

    if(clubLevelA < clubLevelB) return -1;

    if(clubLevelA > clubLevelB) return 1;

    if(a.index < b.index) return -1;

    if(a.index > b.index) return 1;

    return 0;
}
