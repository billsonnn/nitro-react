import { GroupBadgePartsComposer, GroupBadgePartsEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { IGroupCustomize, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';

const useGroupState = () =>
{
    const [ groupCustomize, setGroupCustomize ] = useState<IGroupCustomize>(null);

    useMessageEvent<GroupBadgePartsEvent>(GroupBadgePartsEvent, event =>
    {
        const parser = event.getParser();

        const customize: IGroupCustomize = {
            badgeBases: [],
            badgeSymbols: [],
            badgePartColors: [],
            groupColorsA: [],
            groupColorsB: []
        };

        parser.bases.forEach((images, id) => customize.badgeBases.push({ id, images }));
        parser.symbols.forEach((images, id) => customize.badgeSymbols.push({ id, images }));
        parser.partColors.forEach((color, id) => customize.badgePartColors.push({ id, color }));
        parser.colorsA.forEach((color, id) => customize.groupColorsA.push({ id, color }));
        parser.colorsB.forEach((color, id) => customize.groupColorsB.push({ id, color }));

        const CompareId = (a: { id: number }, b: { id: number }) =>
        {
            if(a.id < b.id) return -1;

            if(a.id > b.id) return 1;

            return 0;
        }

        customize.badgeBases.sort(CompareId);
        customize.badgeSymbols.sort(CompareId);
        customize.badgePartColors.sort(CompareId);
        customize.groupColorsA.sort(CompareId);
        customize.groupColorsB.sort(CompareId);

        setGroupCustomize(customize);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GroupBadgePartsComposer());
    }, []);

    return { groupCustomize };
}

export const useGroup = () => useBetween(useGroupState);
