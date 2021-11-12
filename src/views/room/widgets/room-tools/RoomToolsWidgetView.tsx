import { RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetZoomToggleMessage } from '../../../../api';
import { NavigatorEvent } from '../../../../events';
import { ChatHistoryEvent } from '../../../../events/chat-history/ChatHistoryEvent';
import { dispatchUiEvent } from '../../../../hooks/events';
import { SendMessageHook } from '../../../../hooks/messages';
import { useRoomContext } from '../../context/RoomContext';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const { widgetHandler = null } = useRoomContext();

    const [ isExpended, setIsExpanded ] = useState(false);
    const [ isZoomedIn, setIsZoomedIn ] = useState(false);
    const [ isLiked, setIsLiked ] = useState(false);

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
    
    return (
        <div className={'nitro-room-tools ps-3 d-flex' + classNames({ ' open': isExpended })}>
            <div className="list-group list-group-flush w-100 me-1">
                <div className="list-group-item" onClick={ () => handleToolClick('settings') }>
                    <i className="fas fa-cog me-2" />{ LocalizeText('room.settings.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('zoom') }>
                    <i className={ 'fas me-2 ' +classNames({ 'fa-search-minus': !isZoomedIn, 'fa-search-plus': isZoomedIn }) } />{ LocalizeText('room.zoom.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('chat_history') }>
                    <i className="fas fa-comment-alt me-2" />{ LocalizeText('room.chathistory.button.text') }
                </div>
                <div className={ 'list-group-item' + classNames({ ' disabled': isLiked })} onClick={ () => handleToolClick('like_room') }>
                    <i className="fas fa-heart me-2" />{ LocalizeText('room.like.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('toggle_room_link') }>
                    <i className="fas fa-link me-2" />{ LocalizeText('navigator.embed.caption') }
                </div>
            </div>
            <div className="cursor-pointer d-flex align-items-center px-2" onClick={() => setIsExpanded(value => !value)}>
                <i className={ 'fas ' + classNames({ 'fa-chevron-left': isExpended, 'fa-chevron-right': !isExpended }) } />
            </div>
        </div>
    );
};
