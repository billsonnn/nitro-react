import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ChatWidgetMessageViewProps } from './ChatWidgetMessageView.types';

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const [ messageParts, setMessageParts ] = useState<{text: string, className?: string, style?: any, onClick?: () => void}[]>(null);
    const elementRef = useRef<HTMLDivElement>();

    const onClick = useCallback((event: MouseEvent) =>
    {

    }, []);

    // useEffect(() =>
    // {
    //     if(messageParts) return;

    //     const userNameMention = '@' + GetSessionDataManager().userName;

    //     const matches = [...chat.text.matchAll(new RegExp(userNameMention + '\\b', 'gi'))];

    //     if(matches.length > 0)
    //     {
    //         const prevText = chat.text.substr(0, matches[0].index);
    //         const postText = chat.text.substring(matches[0].index + userNameMention.length, chat.text.length);

    //         setMessageParts(
    //             [
    //                 { text: prevText },
    //                 { text: userNameMention, className: 'chat-mention', onClick: () => {alert('I clicked in the mention')}},
    //                 { text: postText }
    //             ]
    //         );
    //     }
    //     else
    //     {
    //         setMessageParts(
    //             [
    //                 { text: chat.text }
    //             ]
    //         );
    //     }
        
    // }, [ chat ]);

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

    useEffect(() =>
    {
        setIsVisible(chat.visible);
    }, [ chat.visible ]);

    return (
        <div ref={ elementRef } className="bubble-container" style={ { visibility: (isVisible ? 'visible' : 'hidden') } }>
            { (chat.styleId === 0) && <div className="user-container-bg" style={ { backgroundColor: chat.color } } /> }
            <div className={ 'chat-bubble bubble-' + chat.styleId + ' type-' + chat.type } onClick={ onClick }>
                <div className="user-container">
                    { (chat.imageUrl && (chat.imageUrl !== '')) && <div className="user-image" style={ { backgroundImage: 'url(' + chat.imageUrl + ')' } } /> }
                </div>
                <div className="chat-content">
                    <b className="username mr-1" dangerouslySetInnerHTML={ {__html: `${ chat.username }: ` } } />
                    { chat.text }
                    <span className="message"> {
                        messageParts && messageParts.map((part, index) =>
                            {
                                return <span key={ index } className={ part.className } style={ part.style } onClick={ part.onClick }>{ part.text }</span>
                            })
                    }</span>
                </div>
                <div className="pointer"></div>
            </div>
        </div>
    );
}
