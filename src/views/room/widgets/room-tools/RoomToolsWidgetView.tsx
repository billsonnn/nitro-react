import classNames from 'classnames';
import { RoomLikeRoomComposer } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { SendMessageHook } from '../../../../hooks/messages';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetZoomToggleMessage } from '../../messages';
import { RoomToolsWidgetViewProps } from './RoomToolsWidgetView.types';

export const RoomToolsWidgetView: FC<RoomToolsWidgetViewProps> = props =>
{
    const { widgetHandler = null } = useRoomContext();

    const [ isExpended, setIsExpanded ] = useState(false);
    const [ isZoomedIn, setIsZoomedIn ] = useState(false);
    const [ liked, setLiked ] = useState(false);

    const handleToolClick = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'settings':
                return;
            case 'zoom':
                widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage(!isZoomedIn));
                setIsZoomedIn(value => !value);
                return;
            case 'chat_history':
                return;
            case 'like_room':
                if(liked) return;

                SendMessageHook(new RoomLikeRoomComposer(1));
                setLiked(true);
                return;
            case 'room_link':
                return;
        }
    }, [ isZoomedIn, liked, widgetHandler ]);
    
    return (
        <div className={'nitro-room-tools ps-3 d-flex' + classNames({' open': isExpended})}>
            <div className="list-group list-group-flush w-100 me-1">
                <div className="list-group-item" onClick={ () => handleToolClick('settings') }>
                    <i className="fas fa-cog me-2" />{ LocalizeText('room.settings.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('zoom') }>
                    <i className={ 'fas me-2 ' +classNames({'fa-search-minus': !isZoomedIn, 'fa-search-plus': isZoomedIn}) } />{ LocalizeText('room.zoom.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('chat_history') }>
                    <i className="fas fa-comment-alt me-2" />{ LocalizeText('room.chathistory.button.text') }
                </div>
                <div className={ 'list-group-item' + classNames({' disabled': liked})} onClick={ () => handleToolClick('like_room') }>
                    <i className="fas fa-heart me-2" />{ LocalizeText('room.like.button.text') }
                </div>
                <div className="list-group-item" onClick={ () => handleToolClick('room_link') }>
                    <i className="fas fa-link me-2" />{ LocalizeText('navigator.embed.caption') }
                </div>
            </div>
            <div className="cursor-pointer d-flex align-items-center px-2" onClick={() => setIsExpanded(value => !value)}>
                <i className={ 'fas ' + classNames({'fa-chevron-left': isExpended, 'fa-chevron-right': !isExpended}) } />
            </div>
        </div>
    );
};
