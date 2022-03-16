import { GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Button, Column, DraggableWindowPosition, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { ModToolsOpenRoomChatlogEvent } from '../../../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { BatchUpdates, DispatchUiEvent, UseMessageEventHook } from '../../../../hooks';

interface ModToolsRoomViewProps
{
    roomId: number;
    onCloseClick: () => void;
}

export const ModToolsRoomView: FC<ModToolsRoomViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;

    const [ infoRequested, setInfoRequested ] = useState(false);
    const [ loadedRoomId, setLoadedRoomId ] = useState(null);

    const [ name, setName ] = useState(null);
    const [ ownerId, setOwnerId ] = useState(null);
    const [ ownerName, setOwnerName ] = useState(null);
    const [ ownerInRoom, setOwnerInRoom ] = useState(false);
    const [ usersInRoom, setUsersInRoom ] = useState(0);

    //form data
    const [ kickUsers, setKickUsers ] = useState(false);
    const [ lockRoom, setLockRoom ] = useState(false);
    const [ changeRoomName, setChangeRoomName ] = useState(false);
    const [ message, setMessage ] = useState('');

    const onModtoolRoomInfoEvent = useCallback((event: ModeratorRoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.flatId !== roomId) return;

        BatchUpdates(() =>
        {
            setLoadedRoomId(parser.data.flatId);
            setName(parser.data.room.name);
            setOwnerId(parser.data.ownerId);
            setOwnerName(parser.data.ownerName);
            setOwnerInRoom(parser.data.ownerInRoom);
            setUsersInRoom(parser.data.userCount);
        });
    }, [ roomId ]);

    UseMessageEventHook(ModeratorRoomInfoEvent, onModtoolRoomInfoEvent);

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'alert_only':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
            case 'send_message':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
        }
    }, [ changeRoomName, kickUsers, lockRoom, message, roomId ]);

    useEffect(() =>
    {
        if(infoRequested) return;
        
        SendMessageComposer(new GetModeratorRoomInfoMessageComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    return (
        <NitroCardView className="nitro-mod-tools-room" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT}>
            <NitroCardHeaderView headerText={ 'Room Info' + (name ? ': ' + name : '') } onCloseClick={ event => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Flex gap={ 2 }>
                    <Column justifyContent="center" grow gap={ 1 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">Room Owner:</Text>
                            <Text underline pointer truncate>{ ownerName }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">Users in room:</Text>
                            <Text>{ usersInRoom }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">Owner in room:</Text>
                            <Text>{ ownerInRoom ? 'Yes' : 'No' }</Text>
                        </Flex>
                    </Column>
                    <Column gap={ 1 }>
                        <Button onClick={ event => TryVisitRoom(roomId) }>Visit Room</Button>
                        <Button onClick={ event => DispatchUiEvent(new ModToolsOpenRoomChatlogEvent(roomId)) }>Chatlog</Button>
                    </Column>
                </Flex>
                <Column className="bg-muted rounded p-2" gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ kickUsers } onChange={ event => setKickUsers(event.target.checked) } />
                        <Text small>Kick everyone out</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ lockRoom } onChange={ event => setLockRoom(event.target.checked) } />
                        <Text small>Enable the doorbell</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ changeRoomName } onChange={ event => setChangeRoomName(event.target.checked) }/>
                        <Text small>Change room name</Text>
                    </Flex>
                </Column>
                <textarea className="form-control" placeholder="Type a mandatory message to the users in this text box..." value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Flex justifyContent="between">
                    <Button variant="danger" onClick={ event => handleClick('send_message') }>Send Caution</Button>
                    <Button onClick={ event => handleClick('alert_only') }>Send Alert only</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
