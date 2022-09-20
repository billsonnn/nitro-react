import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { AddEventLinkTracker, ChatEntryType, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useChatHistory } from '../../hooks';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ searchText, setSearchText ] = useState<string>('');
    const { chatHistory = [] } = useChatHistory();
    const elementRef = useRef<List>(null);

    const cache = useMemo(() => new CellMeasurerCache({ defaultHeight: 35, fixedWidth: true }), []);

    const filteredChatHistory = useMemo(() => 
    {
        if (searchText.length === 0) return chatHistory;

        let text = searchText.toLowerCase();

        return chatHistory.filter(entry => (entry.message.toLowerCase().includes(text)) || entry.name.includes(text));
    }, [ chatHistory, searchText ]);

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollToRow(-1);
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

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = filteredChatHistory[props.index];

        if (!item) return null;

        return (
            <CellMeasurer cache={ cache } columnIndex={ 0 } key={ props.key } parent={ props.parent } rowIndex={ props.index }>
                <Flex alignItems="center" style={ props.style } className="p-1" gap={ 2 }>
                    <Text variant="muted">{ item.timestamp }</Text>
                    { (item.type === ChatEntryType.TYPE_CHAT) &&
                        <div className="bubble-container" style={ { position: 'relative' } }>
                            { (item.style === 0) &&
                            <div className="user-container-bg" style={ { backgroundColor: item.color } } /> }
                            <div className={ `chat-bubble bubble-${ item.style } type-${ item.chatType }` } style={ { maxWidth: '100%' } }>
                                <div className="user-container">
                                    { item.imageUrl && (item.imageUrl.length > 0) &&
                        <div className="user-image" style={ { backgroundImage: `url(${ item.imageUrl })` } } /> }
                                </div>
                                <div className="chat-content">
                                    <b className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ item.name }: ` } } />
                                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ item.message }` } } />
                                </div>
                            </div>
                        </div> }
                    { (item.type === ChatEntryType.TYPE_ROOM_INFO) &&
                        <>
                            <i className="icon icon-small-room" />
                            <Text textBreak wrap grow>{ item.name }</Text>
                        </> }
                </Flex>
            </CellMeasurer>
        );
    };

    return (
        <NitroCardView uniqueKey="chat-history" className="nitro-chat-history" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('room.chathistory.button.text') } onCloseClick={ event => setIsVisible(false) }/>
            <NitroCardContentView overflow="hidden">
                <Flex column fullHeight gap={ 2 }>
                    <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchText } onChange={ event => setSearchText(event.target.value) } />
                    <div className="h-100">
                        <AutoSizer defaultWidth={ 300 } defaultHeight={ 170 }>
                            { ({ height, width }) => 
                            {
                                cache.clearAll();

                                return (
                                    <List
                                        ref={ elementRef }
                                        width={ width }
                                        height={ height }
                                        rowCount={ filteredChatHistory.length }
                                        rowHeight={ 35 }
                                        className={ 'chat-history-list' }
                                        rowRenderer={ RowRenderer }
                                        deferredMeasurementCache={ cache } />
                                )
                            } }
                        </AutoSizer>
                    </div>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
