import { AddLinkEventTracker, GroupPurchasedEvent, GroupSettingsComposer, ILinkEventTracker, RemoveLinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer, TryVisitRoom } from '../../api';
import { useGroup, useMessageEvent } from '../../hooks';
import { GroupCreatorView } from './views/GroupCreatorView';
import { GroupInformationStandaloneView } from './views/GroupInformationStandaloneView';
import { GroupManagerView } from './views/GroupManagerView';
import { GroupMembersView } from './views/GroupMembersView';

export const GroupsView: FC<{}> = props =>
{
    const [ isCreatorVisible, setCreatorVisible ] = useState<boolean>(false);
    const {} = useGroup();

    useMessageEvent<GroupPurchasedEvent>(GroupPurchasedEvent, event =>
    {
        const parser = event.getParser();

        setCreatorVisible(false);
        TryVisitRoom(parser.roomId);
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
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
                        SendMessageComposer(new GroupSettingsComposer(Number(parts[2])));
                        return;
                }
            },
            eventUrlPrefix: 'groups/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);
    
    return (
        <>
            { isCreatorVisible &&
                <GroupCreatorView onClose={ () => setCreatorVisible(false) } /> }
            { !isCreatorVisible &&
                <GroupManagerView /> }
            <GroupMembersView />
            <GroupInformationStandaloneView />
        </>
    );
};
