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
    );
};
