import { RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetZoomToggleMessage } from '../../../../api';
import { Base } from '../../../../common/Base';
import { Column } from '../../../../common/Column';
import { NavigatorEvent } from '../../../../events';
import { ChatHistoryEvent } from '../../../../events/chat-history/ChatHistoryEvent';
import { dispatchUiEvent } from '../../../../hooks/events';
import { SendMessageHook } from '../../../../hooks/messages';
import { useRoomContext } from '../../context/RoomContext';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState(false);
    const [ isLiked, setIsLiked ] = useState(false);
    const { widgetHandler = null } = useRoomContext();

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
    
    return (
        <Column center className="nitro-room-tools p-2">
            <Base pointer title={ LocalizeText('room.settings.button.text') } className="icon icon-cog" onClick={ () => handleToolClick('settings') } />
            <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={ 'icon ' + classNames({ 'icon-zoom-less': !isZoomedIn, 'icon-zoom-more': isZoomedIn }) } />
            <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } className="icon icon-chat-history" />
            { !isLiked && <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className="icon icon-like-room" /> }
        </Column>
    );
}
