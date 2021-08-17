import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetDoorbellEvent, RoomWidgetLetUserInMessage } from '../../../../api';
import { CreateEventDispatcherHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { useRoomContext } from '../../context/RoomContext';
import { DoorbellWidgetItemView } from './doorbell-item/DoorbellWidgetItemView';

export const DoorbellWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ users, setUsers ] = useState<string[]>([]);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const addUser = useCallback((userName: string) =>
    {
        if(users.indexOf(userName) >= 0) return;

        const newUsers = [ ...users, userName ];

        setUsers(newUsers);
        setIsVisible(true);
    }, [ users ]);

    const removeUser = useCallback((userName: string) =>
    {
        const index = users.indexOf(userName);

        if(index === -1) return;

        const newUsers = [ ...users ];

        newUsers.splice(index, 1);

        setUsers(newUsers);

        if(!newUsers.length) setIsVisible(false);
    }, [ users ]);

    const onRoomWidgetDoorbellEvent = useCallback((event: RoomWidgetDoorbellEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetDoorbellEvent.RINGING:
                addUser(event.userName);
                return;
            case RoomWidgetDoorbellEvent.REJECTED:
            case RoomWidgetDoorbellEvent.ACCEPTED:
                removeUser(event.userName);
                return;
        }
    }, [ addUser, removeUser ]);

    CreateEventDispatcherHook(RoomWidgetDoorbellEvent.RINGING, eventDispatcher, onRoomWidgetDoorbellEvent);
    CreateEventDispatcherHook(RoomWidgetDoorbellEvent.REJECTED, eventDispatcher, onRoomWidgetDoorbellEvent);
    CreateEventDispatcherHook(RoomWidgetDoorbellEvent.ACCEPTED, eventDispatcher, onRoomWidgetDoorbellEvent);

    const answer = useCallback((userName: string, flag: boolean) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetLetUserInMessage(userName, flag));

        removeUser(userName);
    }, [ widgetHandler, removeUser ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-widget-doorbell" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView>
                <div className="row row-cols-1 doorbell-user-list">
                    { (users.length > 0) && users.map(userName =>
                        {
                            return <DoorbellWidgetItemView key={ userName } userName={ userName } accept={ () => answer(userName, true) } deny={ () => answer(userName, false) } />;
                        }) }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
