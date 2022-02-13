import { GetGuestRoomResultEvent, RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetZoomToggleMessage } from '../../../../api';
import { NavigatorEvent } from '../../../../events';
import { ChatHistoryEvent } from '../../../../events/chat-history/ChatHistoryEvent';
import { dispatchUiEvent } from '../../../../hooks/events';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { useRoomContext } from '../../context/RoomContext';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const { widgetHandler = null } = useRoomContext();

    const [ isExpended, setIsExpanded ] = useState(false);
    const [ isZoomedIn, setIsZoomedIn ] = useState(false);
    const [ isLiked, setIsLiked ] = useState(false);

    const [ roomName, setRoomName ] = useState(null);
    const [ roomOwner, setRoomOwner ] = useState(null);
    const [ roomTags, setRoomTags ] = useState(null);
    const [ roomInfoOpacity, setRoomInfoOpacity ] = useState(false);
    const [ roomInfoDisplay, setRoomInfoDisplay ] = useState(false);

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
                dispatchUiEvent(new ChatHistoryEvent(ChatHistoryEvent.TOGGLE_CHAT_HISTORY));
                //setIsExpanded(false); close this ??
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

        let updated = false;

        if(roomName !== parser.data.roomName)
        {
            updated = true;
            setRoomName(parser.data.roomName);
        }

        if(roomOwner !== parser.data.ownerName)
        {
            updated = true;
            setRoomOwner(parser.data.ownerName);
        }

        if(roomTags !== parser.data.tags)
        {
            updated = true;
            setRoomTags(parser.data.tags);
        }

        if(updated)
        {
            setRoomInfoOpacity(true);
            setRoomInfoDisplay(true);
            
            setTimeout(() =>
            {
                setRoomInfoOpacity(false);
                
                setTimeout(() => setRoomInfoDisplay(false), 1000);
            }, 3000);
        }
    }, [ roomName, roomOwner, roomTags ]);

    CreateMessageHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);
    
    return (
        <div className={ 'nitro-room-tools align-items-center d-flex gap-3' + classNames({ ' open': isExpended }) }>
            <div className="nitro-room-tools-content ps-3 d-flex">
                <div className="d-flex flex-column gap-2 w-100 py-2 pe-2">
                    <div className="d-flex align-items-center gap-2 cursor-pointer tools-item" onClick={ () => handleToolClick('settings') }>
                        <i className="icon icon-cog" /> { LocalizeText('room.settings.button.text') }
                    </div>
                    <div className="d-flex align-items-center gap-2 cursor-pointer tools-item" onClick={ () => handleToolClick('zoom') }>
                        <i className={ 'icon ' +classNames({ 'icon-zoom-less': !isZoomedIn, 'icon-zoom-more': isZoomedIn }) } />{ LocalizeText('room.zoom.button.text') }
                    </div>
                    <div className="d-flex align-items-center gap-2 cursor-pointer tools-item" onClick={ () => handleToolClick('chat_history') }>
                        <i className="icon icon-chat-history" />{ LocalizeText('room.chathistory.button.text') }
                    </div>
                    <div className={ 'd-flex align-items-center gap-2 cursor-pointer tools-item' + classNames({ ' disabled': isLiked })} onClick={ () => handleToolClick('like_room') }>
                        <i className="icon icon-like-room" /> { LocalizeText('room.like.button.text') }
                    </div>
                    <div className="d-flex align-items-center gap-2 cursor-pointer tools-item" onClick={ () => handleToolClick('toggle_room_link') }>
                        <i className="icon icon-room-link" />{ LocalizeText('navigator.embed.caption') }
                    </div>
                </div>
                <div className="cursor-pointer d-flex align-items-center px-2" onClick={() => setIsExpanded(value => !value)}>
                    <i className={ 'fas ' + classNames({ 'fa-chevron-left': isExpended, 'fa-chevron-right': !isExpended }) } />
                </div>
            </div>
            <div className="nitro-room-tools-info rounded py-2 px-3 d-flex flex-column gap-2" style={ { 'opacity': roomInfoOpacity ? '1' : '0', 'display': roomInfoDisplay ? 'block' : 'none' } }>
                <div className="d-flex flex-column gap-1">
                    <div className="h4 m-0">{ roomName }</div>
                    <div className="h4 text-muted m-0">{ roomOwner }</div>
                </div>
                { roomTags && roomTags.length > 0 && <div className="d-flex gap-2">
                    { roomTags.map(tag => 
                    {
                        return <div className="rounded bg-primary text-white p-1 text-sm">#{ tag }</div>
                    }) }
                </div> }
            </div>
        </div>
    );
};
