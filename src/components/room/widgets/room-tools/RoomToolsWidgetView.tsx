import { GetGuestRoomResultEvent, RateFlatMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, classNames, Column, Flex, Text, TransitionAnimation, TransitionAnimationTypes } from '../../../../common';
import { useMessageEvent, useNavigator, useRoom } from '../../../../hooks';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { navigatorData = null } = useNavigator();
    const { roomSession = null } = useRoom();

    const handleToolClick = (action: string) =>
    {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                setIsZoomedIn(prevValue =>
                {
                    let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1);
                    
                    if(!prevValue) scale /= 2;
                    else scale *= 2;
                    
                    GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale);

                    return !prevValue;
                });
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                SendMessageComposer(new RateFlatMessageComposer(1));
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
        }
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    });

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);
    
    return (
        <Flex className="nitro-room-tools-container" gap={ 2 }>
            <Column center className="nitro-room-tools p-2">
                <Base pointer title={ LocalizeText('room.settings.button.text') } className="icon icon-cog" onClick={ () => handleToolClick('settings') } />
                <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={ classNames('icon', (!isZoomedIn && 'icon-zoom-less'), (isZoomedIn && 'icon-zoom-more')) } />
                <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } className="icon icon-chat-history" />
                { navigatorData.canRate &&
                    <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className="icon icon-like-room" /> }
            </Column>
            <Column justifyContent="center">
                <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ isOpen } timeout={ 300 }>
                    <Column center>
                        <Column className="nitro-room-tools-info rounded py-2 px-3">
                            <Column gap={ 1 }>
                                <Text wrap variant="white" fontSize={ 4 }>{ roomName }</Text>
                                <Text variant="muted" fontSize={ 5 }>{ roomOwner }</Text>
                            </Column>
                            { roomTags && roomTags.length > 0 &&
                                <Flex gap={ 2 }>
                                    { roomTags.map((tag, index) => <Text key={ index } small variant="white" className="rounded bg-primary p-1">#{ tag }</Text>) }
                                </Flex> }
                        </Column>
                    </Column>
                </TransitionAnimation>
            </Column>
        </Flex>
    );
}
