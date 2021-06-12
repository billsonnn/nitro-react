import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ChatWidgetMessageViewProps } from './ChatWidgetMessageView.types';

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

    const onClick = useCallback((event: MouseEvent) =>
    {

    }, []);

    useEffect(() =>
    {
        const element = elementRef.current;

        if(!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;
        
        let left = chat.lastLeft;
        let top = chat.lastTop;

        if(!left && !top)
        {
            left = (chat.location.x - (width / 2));
            top = (element.parentElement.offsetHeight - height);
            
            chat.lastLeft = left;
            chat.lastTop = top;
        }

        element.style.left = (left + 'px');
        element.style.top = (top + 'px');

        if(!chat.visible)
        {
            makeRoom(chat);
        }

        chat.visible = true;
        //setIsVisible(true);

        return () =>
        {
            chat.elementRef = null;
        }
    }, [ elementRef, isVisible, chat, makeRoom ]);

    return (
        <div ref={ elementRef } className="bubble-container" style={ { visibility: (isVisible ? 'visible' : 'hidden') } }>
            { (chat.styleId === 0) && <div className="user-container-bg" style={ { backgroundColor: chat.color } } /> }
            <div className={ 'chat-bubble bubble-' + chat.styleId + ' type-' + chat.type } onClick={ onClick }>
                <div className="user-container">
                    { (chat.imageUrl && (chat.imageUrl !== '')) && <div className="user-image" style={ { backgroundImage: 'url(' + chat.imageUrl + ')' } } /> }
                </div>
                <div className="chat-content">
                    <b className="username mr-1">{ chat.username }</b><span className="message"> { chat.text }</span>
                </div>
                <div className="pointer"></div>
            </div>
        </div>
    );
}
