import { GroupBadgePartsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks';
import { useGroupsContext } from './context/GroupsContext';
import { GroupsActions } from './context/GroupsContext.types';

export const GroupsMessageHandler: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();

    const onGroupBadgePartsEvent = useCallback((event: GroupBadgePartsEvent) =>
    {
        const parser = event.getParser();

        dispatchGroupsState({
            type: GroupsActions.SET_BADGE_PARTS,
            payload: {
                arrayMaps: [ parser.bases, parser.symbols ],
                stringMaps: [ parser.partColors, parser.colorsA, parser.colorsB ]
            }
        })
    }, [ dispatchGroupsState ]);

    CreateMessageHook(GroupBadgePartsEvent, onGroupBadgePartsEvent);

    return null;
};
