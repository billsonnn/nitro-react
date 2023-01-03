import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, ChatEntryType, GetSessionDataManager, GetUserProfile, LocalizeText, RemoveLinkEventTracker, ReportType } from '../../api';
import { Flex, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useChatHistory, useHelp } from '../../hooks';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ searchText, setSearchText ] = useState<string>('');
    const { chatHistory = [], setMessengerHistory = null } = useChatHistory();
    const { report = null } = useHelp();

    const filteredChatHistory = useMemo(() =>
    {
        if (searchText.length === 0) return chatHistory;

        let text = searchText.toLowerCase();

        return chatHistory.filter(entry => ((entry.message && entry.message.toLowerCase().includes(text))) || (entry.name && entry.name.toLowerCase().includes(text)));
    }, [ chatHistory, searchText ]);

    const reportMessage = (message: any) =>
    {
        setMessengerHistory(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue.push({ id: message.id, webId: message.webId, entityId: message.entityId, name: '', message: message.message, roomId: message.roomId, timestamp: message.timestamp, type: ChatEntryType.TYPE_IM });

            return newValue;
        });

        report(ReportType.IM, { reportedUserId: message.webId });
    }

    /* useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }, [ isVisible ]); */

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
            <NitroCardContentView overflow="hidden" gap={ 2 }>
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchText } onChange={ event => setSearchText(event.target.value) } />
                <InfiniteScroll rows={ filteredChatHistory } estimateSize={ 35 } rowRender={ row =>
                {
                    return (
                        <Flex alignItems="center" className="p-1" gap={ 2 }>
                            <Text variant="muted">{ row.timestamp }</Text>
                            { (row.type === ChatEntryType.TYPE_CHAT && GetSessionDataManager().userId !== row.webId ) &&
                                <FontAwesomeIcon cursor="pointer" color="red" icon="flag" onClick={ () => reportMessage(row) } />
                            }
                            { (row.type === ChatEntryType.TYPE_CHAT) &&
                                <div className="bubble-container" style={ { position: 'relative' } }>
                                    { (row.style === 0) &&
                                    <div className="user-container-bg" style={ { backgroundColor: row.color } } /> }
                                    <div className={ `chat-bubble bubble-${ row.style } type-${ row.chatType }` } style={ { maxWidth: '100%' } }>
                                        <div className="user-container cursor-pointer" onClick={ event => GetUserProfile(row.webId) }>
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
