import { IFigurePartSet } from '@nitrots/nitro-renderer';

export const AvatarEditorPartSorter = (hcFirst: boolean) =>
{
    return (a: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }, b: { partSet: IFigurePartSet, usesColor: boolean, isClear?: boolean }) =>
    {
        const clubLevelA = (!a.partSet ? -1 : a.partSet.clubLevel);
        const clubLevelB = (!b.partSet ? -1 : b.partSet.clubLevel);
        const isSellableA = (!a.partSet ? false : a.partSet.isSellable);
        const isSellableB = (!b.partSet ? false : b.partSet.isSellable);

        if(isSellableA && !isSellableB) return 1;

        if(isSellableB && !isSellableA) return -1;

        if(hcFirst)
        {
            if(clubLevelA > clubLevelB) return -1;

            if(clubLevelA < clubLevelB) return 1;
        }
        else
        {
            if(clubLevelA < clubLevelB) return -1;

            if(clubLevelA > clubLevelB) return 1;
        }

        if(a.partSet.id < b.partSet.id) return -1;

        if(a.partSet.id > b.partSet.id) return 1;

        return 0;
    };
};
