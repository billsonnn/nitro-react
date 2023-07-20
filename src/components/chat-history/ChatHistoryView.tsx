import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AddEventLinkTracker, ChatEntryType, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Flex, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useChatHistory } from '../../hooks';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ searchText, setSearchText ] = useState<string>('');
    const { chatHistory = [] } = useChatHistory();
    const elementRef = useRef<HTMLDivElement>(null);

    const filteredChatHistory = useMemo(() => 
    {
        if (searchText.length === 0) return chatHistory;

        let text = searchText.toLowerCase();

        return chatHistory.filter(entry => ((entry.message && entry.message.toLowerCase().includes(text))) || (entry.name && entry.name.toLowerCase().includes(text)));
    }, [ chatHistory, searchText ]);

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }, [ isVisible ]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'chat-history/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if(!isVisible) return null;

    return (
        <NitroCardView uniqueKey="chat-history" className="nitro-chat-history" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('room.chathistory.button.text') } onCloseClick={ event => setIsVisible(false) }/>
            <NitroCardContentView innerRef={ elementRef } overflow="hidden" gap={ 2 }>
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchText } onChange={ event => setSearchText(event.target.value) } />
                <InfiniteScroll rows={ filteredChatHistory } scrollToBottom={ true } rowRender={ row =>
                {
                    return (
                        <Flex alignItems="center" className="p-1" gap={ 2 }>
                            <Text variant="muted">{ row.timestamp }</Text>
                            { (row.type === ChatEntryType.TYPE_CHAT) &&
                                <div className="bubble-container" style={ { position: 'relative' } }>
                                    { (row.style === 0) &&
                                    <div className="user-container-bg" style={ { backgroundColor: row.color } } /> }
                                    <div className={ `chat-bubble bubble-${ row.style } type-${ row.chatType }` } style={ { maxWidth: '100%' } }>
                                        <div className="user-container">
                                            { row.imageUrl && (row.imageUrl.length > 0) &&
                                <div className="user-image" style={ { backgroundImage: `url(${ row.imageUrl })` } } /> }
                                        </div>
                                        <div className="chat-content">
                                            <b className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ row.name }: ` } } />
                                            <span className="message" dangerouslySetInnerHTML={ { __html: `${ row.message }` } } />
                                        </div>
                                    </div>
                                </div> }
                            { (row.type === ChatEntryType.TYPE_ROOM_INFO) &&
                                <>
                                    <i className="icon icon-small-room" />
                                    <Text textBreak wrap grow>{ row.name }</Text>
                                </> }
                        </Flex>
                    )
                } } />
            </NitroCardContentView>
        </NitroCardView>
    );
}
