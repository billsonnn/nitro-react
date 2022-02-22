import { GetGuestRoomResultEvent, RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, LocalizeText, RoomWidgetZoomToggleMessage } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';
import { NavigatorEvent } from '../../../../events';
import { dispatchUiEvent } from '../../../../hooks/events';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { useRoomContext } from '../../context/RoomContext';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState(false);
    const [ isLiked, setIsLiked ] = useState(false);
    const { widgetHandler = null } = useRoomContext();

    const [ roomName, setRoomName ] = useState(null);
    const [ roomOwner, setRoomOwner ] = useState(null);
    const [ roomTags, setRoomTags ] = useState(null);
    const [ roomInfoDisplay, setRoomInfoDisplay ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);

    const handleToolClick = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'settings':
                dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_INFO));
                return;
            case 'zoom':
                widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage(!isZoomedIn));
                setIsZoomedIn(value => !value);
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                if(isLiked) return;

                SendMessageHook(new RoomLikeRoomComposer(1));
                setIsLiked(true);
                return;
            case 'toggle_room_link':
                dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_ROOM_LINK));
                return;
        }
    }, [ isZoomedIn, isLiked, widgetHandler ]);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);

        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);

        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    }, [ roomName, roomOwner, roomTags ]);

    CreateMessageHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);
    
    return (
        <Flex className="nitro-room-tools-container">
            <Column center className="nitro-room-tools p-2">
                <Base pointer title={ LocalizeText('room.settings.button.text') } className="icon icon-cog" onClick={ () => handleToolClick('settings') } />
                <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={ 'icon ' + classNames({ 'icon-zoom-less': !isZoomedIn, 'icon-zoom-more': isZoomedIn }) } />
                <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } className="icon icon-chat-history" />
                { !isLiked && <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className="icon icon-like-room" /> }
            </Column>
            { isOpen &&
                <Column center>
                    <Column className="nitro-room-tools-info rounded py-2 px-3">
                        <Column gap={ 1 }>
                            <Text variant="white" fontSize={ 4 }>{ roomName }</Text>
                            <Text variant="muted" fontSize={ 5 }>{ roomOwner }</Text>
                        </Column>
                        { roomTags && roomTags.length > 0 &&
                            <div className="d-flex gap-2">
                                { roomTags.map((tag: string) => <div className="rounded bg-primary text-white p-1 text-sm">#{ tag }</div>) }
                            </div> }
                    </Column>
                </Column> }
        </Flex>
    );
}
