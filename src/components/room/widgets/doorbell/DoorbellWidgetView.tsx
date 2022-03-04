import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetDoorbellEvent, RoomWidgetLetUserInMessage } from '../../../../api';
import { Base, Button, Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { BatchUpdates, UseEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';

export const DoorbellWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ users, setUsers ] = useState<string[]>([]);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const addUser = useCallback((userName: string) =>
    {
        if(users.indexOf(userName) >= 0) return;

        BatchUpdates(() =>
        {
            setUsers([ ...users, userName ]);
            setIsVisible(true);
        });
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

    UseEventDispatcherHook(RoomWidgetDoorbellEvent.RINGING, eventDispatcher, onRoomWidgetDoorbellEvent);
    UseEventDispatcherHook(RoomWidgetDoorbellEvent.REJECTED, eventDispatcher, onRoomWidgetDoorbellEvent);
    UseEventDispatcherHook(RoomWidgetDoorbellEvent.ACCEPTED, eventDispatcher, onRoomWidgetDoorbellEvent);

    const answer = useCallback((userName: string, flag: boolean) =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetLetUserInMessage(userName, flag));

        removeUser(userName);
    }, [ widgetHandler, removeUser ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-widget-doorbell" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView overflow="hidden" gap={ 0 }>
                <Column gap={ 2 }>
                    <Grid gap={ 1 } className="text-black fw-bold border-bottom px-1 pb-1">
                        <Base className="g-col-6">Username</Base>
                        <Base className="g-col-6"></Base>
                    </Grid>
                </Column>
                <Column overflow="auto" className="striped-children" gap={ 0 }>
                    { users && (users.length > 0) && users.map(userName =>
                        {
                            return (
                                <Grid key={ userName } gap={ 1 } alignItems="center" className="text-black border-bottom p-1">
                                    <Base className="g-col-6">{ userName }</Base>
                                    <Base className="g-col-6">
                                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                            <Button variant="success" onClick={ () => answer(userName, true) }>
                                                { LocalizeText('generic.accept') }
                                            </Button>
                                            <Button variant="danger" onClick={ () => answer(userName, false) }>
                                                { LocalizeText('generic.deny') }
                                            </Button>
                                        </Flex>
                                    </Base>
                                </Grid>
                            );
                        }) }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
