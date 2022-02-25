import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { ChatBubbleMessage } from './common/ChatBubbleMessage';

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    onChatClicked: (chat: ChatBubbleMessage) => void;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null, onChatClicked = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => ((event.shiftKey) && onChatClicked(chat));

    useEffect(() =>
    {
        const element = elementRef.current;

        if(!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;
        
        let left = chat.left;
        let top = chat.top;

        if(!left && !top)
        {
            left = (chat.location.x - (width / 2));
            top = (element.parentElement.offsetHeight - height);
            
            chat.left = left;
            chat.top = top;
        }

        if(!chat.visible)
        {
            makeRoom(chat);

            chat.visible = true;
        }

        return () =>
        {
            chat.elementRef = null;
        }
    }, [ elementRef, chat, makeRoom ]);

    useEffect(() => setIsVisible(chat.visible), [ chat.visible ]);

    return (
        <div ref={ elementRef } className="bubble-container" style={ { visibility: (isVisible ? 'visible' : 'hidden') } } onMouseDown={ onMouseDown }>
            { (chat.styleId === 0) && <div className="user-container-bg" style={ { backgroundColor: chat.color } } /> }
            <div className={ 'chat-bubble bubble-' + chat.styleId + ' type-' + chat.type }>
                <div className="user-container">
                    { (chat.imageUrl && (chat.imageUrl !== '')) && <div className="user-image" style={ { backgroundImage: 'url(' + chat.imageUrl + ')' } } /> }
                </div>
                <div className="chat-content">
                    <b className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ chat.username }: ` } } />
                    <span className="message">{ chat.text }</span>
                </div>
                <div className="pointer"></div>
            </div>
        </div>
    );
}
