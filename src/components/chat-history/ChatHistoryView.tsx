import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer, Size } from 'react-virtualized';
import { RenderedRows } from 'react-virtualized/dist/es/List';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Flex, Text } from '../../common';
import { BatchUpdates } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ChatHistoryContextProvider } from './ChatHistoryContext';
import { ChatHistoryMessageHandler } from './ChatHistoryMessageHandler';
import { ChatEntryType } from './common/ChatEntryType';
import { ChatHistoryState } from './common/ChatHistoryState';
import { SetChatHistory } from './common/GetChatHistory';
import { RoomHistoryState } from './common/RoomHistoryState';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ needsScroll, setNeedsScroll ] = useState(false);
    const [ chatHistoryUpdateId, setChatHistoryUpdateId ] = useState(-1);
    const [ roomHistoryUpdateId, setRoomHistoryUpdateId ] = useState(-1);
    const [ chatHistoryState, setChatHistoryState ] = useState(new ChatHistoryState());
    const [ roomHistoryState, setRoomHistoryState ] = useState(new RoomHistoryState());
    const elementRef = useRef<List>(null);

    const cache = useMemo(() => new CellMeasurerCache({ defaultHeight: 25, fixedWidth: true }), []);

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = chatHistoryState.chats[props.index];

        const isDark = (props.index % 2 === 0);

        return (
            <CellMeasurer cache={ cache } columnIndex={ 0 } key={ props.key } parent={ props.parent } rowIndex={ props.index }>
                <Flex key={ props.key } style={ props.style } className="p-1" gap={ 1 }>
                    <Text variant="muted">{ item.timestamp }</Text>
                    { (item.type === ChatEntryType.TYPE_CHAT) &&
                        <>
                            <Text pointer noWrap dangerouslySetInnerHTML={ { __html: (item.name + ':') }} />
                            <Text textBreak wrap grow>{ item.message }</Text>
                        </> }
                    { (item.type === ChatEntryType.TYPE_ROOM_INFO) &&
                        <>
                            <i className="icon icon-small-room" />
                            <Text textBreak wrap grow>{ item.name }</Text>
                        </> }
                </Flex>
            </CellMeasurer>
        );
    };

    const onResize = (info: Size) => cache.clearAll();

    const onRowsRendered = (info: RenderedRows) =>
    {
        if(elementRef && elementRef.current && isVisible && needsScroll)
        {
            elementRef.current.scrollToRow(chatHistoryState.chats.length);
            
            setNeedsScroll(false);
        }
    }

    const linkReceived = useCallback((url: string) =>
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
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'chat-history/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    useEffect(() =>
    {
        const chatState = new ChatHistoryState();
        const roomState = new RoomHistoryState();

        SetChatHistory(chatState);

        chatState.notifier = () => setChatHistoryUpdateId(prevValue => (prevValue + 1));
        roomState.notifier = () => setRoomHistoryUpdateId(prevValue => (prevValue + 1));

        BatchUpdates(() =>
        {
            setChatHistoryState(chatState);
            setRoomHistoryState(roomState);
        });

        return () =>
        {
            chatState.notifier = null;
            roomState.notifier = null;
        };
    }, []);

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible) elementRef.current.scrollToRow(chatHistoryState.chats.length);
        
       setNeedsScroll(true);
    }, [ isVisible, chatHistoryState.chats, chatHistoryUpdateId ]);

    return (
        <ChatHistoryContextProvider value={ { chatHistoryState, roomHistoryState } }>
            <ChatHistoryMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey="chat-history" className="nitro-chat-history">
                    <NitroCardHeaderView headerText={ LocalizeText('room.chathistory.button.text') } onCloseClick={ event => setIsVisible(false) }/>
                    <NitroCardContentView>
                        <AutoSizer defaultWidth={ 300 } defaultHeight={ 200 } onResize={ onResize }>
                            { ({ height, width }) => 
                                {
                                    return (
                                        <List
                                            ref={ elementRef }
                                            width={ width }
                                            height={ height }
                                            rowCount={ chatHistoryState.chats.length }
                                            rowHeight={ cache.rowHeight }
                                            className={ 'chat-history-list' }
                                            rowRenderer={ RowRenderer }
                                            onRowsRendered={ onRowsRendered }
                                            deferredMeasurementCache={ cache } />
                                    )
                                } }
                        </AutoSizer>
                    </NitroCardContentView>
                </NitroCardView> }
        </ChatHistoryContextProvider>
    );
}
