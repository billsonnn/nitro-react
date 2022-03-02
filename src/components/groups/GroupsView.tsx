import { GroupBadgePartsComposer, GroupBadgePartsEvent, GroupPurchasedEvent, GroupSettingsComposer, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker, TryVisitRoom } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks';
import { CompareId } from './common/CompareId';
import { IGroupCustomize } from './common/IGroupCustomize';
import { GroupsContextProvider } from './GroupsContext';
import { GroupCreatorView } from './views/GroupCreatorView';
import { GroupInformationStandaloneView } from './views/GroupInformationStandaloneView';
import { GroupManagerView } from './views/GroupManagerView';
import { GroupMembersView } from './views/GroupMembersView';

export const GroupsView: FC<{}> = props =>
{
    const [ isCreatorVisible, setCreatorVisible ] = useState<boolean>(false);
    const [ groupCustomize, setGroupCustomize ] = useState<IGroupCustomize>(null);

    const onGroupPurchasedEvent = useCallback((event: GroupPurchasedEvent) =>
    {
        const parser = event.getParser();

        setCreatorVisible(false);
        TryVisitRoom(parser.roomId);
    }, []);

    CreateMessageHook(GroupPurchasedEvent, onGroupPurchasedEvent);

    const onGroupBadgePartsEvent = useCallback((event: GroupBadgePartsEvent) =>
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

        customize.badgeBases.sort(CompareId);
        customize.badgeSymbols.sort(CompareId);
        customize.badgePartColors.sort(CompareId);
        customize.groupColorsA.sort(CompareId);
        customize.groupColorsB.sort(CompareId);

        setGroupCustomize(customize);
    }, [ setGroupCustomize ]);

    CreateMessageHook(GroupBadgePartsEvent, onGroupBadgePartsEvent);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'create':
                setCreatorVisible(true);
                return;
            case 'manage':
                if(!parts[2]) return;

                setCreatorVisible(false);
                SendMessageHook(new GroupSettingsComposer(Number(parts[2])));
                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'groups/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    useEffect(() =>
    {
        SendMessageHook(new GroupBadgePartsComposer());
    }, []);
    
    return (
        <GroupsContextProvider value={ { groupCustomize, setGroupCustomize } }>
            <div className="nitro-groups">
                { isCreatorVisible &&
                    <GroupCreatorView onClose={ () => setCreatorVisible(false) } /> }
                { !isCreatorVisible &&
                    <GroupManagerView /> }
                <GroupMembersView />
                <GroupInformationStandaloneView />
            </div>
        </GroupsContextProvider>
    );
};
