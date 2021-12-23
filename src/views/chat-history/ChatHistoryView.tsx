import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer, Size } from 'react-virtualized';
import { RenderedRows } from 'react-virtualized/dist/es/List';
import { ChatHistoryEvent } from '../../events/chat-history/ChatHistoryEvent';
import { useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ChatHistoryMessageHandler } from './ChatHistoryMessageHandler';
import { ChatHistoryState } from './common/ChatHistoryState';
import { SetChatHistory } from './common/GetChatHistory';
import { RoomHistoryState } from './common/RoomHistoryState';
import { ChatHistoryContextProvider } from './context/ChatHistoryContext';
import { ChatEntryType } from './context/ChatHistoryContext.types';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ needsScroll, setNeedsScroll ] = useState(false);
    const [ chatHistoryUpdateId, setChatHistoryUpdateId ] = useState(-1);
    const [ roomHistoryUpdateId, setRoomHistoryUpdateId ] = useState(-1);
    const [ chatHistoryState, setChatHistoryState ] = useState(new ChatHistoryState());
    const [ roomHistoryState, setRoomHistoryState ] = useState(new RoomHistoryState());
    const elementRef = useRef<List>(null);

    useEffect(() =>
    {
        const chatState = new ChatHistoryState();
        const roomState = new RoomHistoryState();

        SetChatHistory(chatState);

        chatState.notifier = () => setChatHistoryUpdateId(prevValue => (prevValue + 1));
        roomState.notifier = () => setRoomHistoryUpdateId(prevValue => (prevValue + 1));

        setChatHistoryState(chatState);
        setRoomHistoryState(roomState);

        return () => {chatState.notifier = null; roomState.notifier = null;};
    }, []);
    
    const onChatHistoryEvent = useCallback((event: ChatHistoryEvent) =>
    {
        switch(event.type)
        {
            case ChatHistoryEvent.SHOW_CHAT_HISTORY:
                setIsVisible(true);
                break;
            case ChatHistoryEvent.HIDE_CHAT_HISTORY:
                setIsVisible(false);
                break;
            case ChatHistoryEvent.TOGGLE_CHAT_HISTORY:
                setIsVisible(!isVisible);
                break;
        }
    }, [isVisible]);

    useUiEvent(ChatHistoryEvent.HIDE_CHAT_HISTORY, onChatHistoryEvent);
    useUiEvent(ChatHistoryEvent.SHOW_CHAT_HISTORY, onChatHistoryEvent);
    useUiEvent(ChatHistoryEvent.TOGGLE_CHAT_HISTORY, onChatHistoryEvent);

    const cache = useMemo(() => 
    {
        return new CellMeasurerCache({
            defaultHeight: 25,
            fixedWidth: true,
            //keyMapper: (index) => chatHistoryState.chats[index].id
        });
    }, []);

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = chatHistoryState.chats[props.index];

        const isDark = (props.index % 2 === 0);

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={props.key}
                parent={props.parent}
                rowIndex={props.index}
            >
                <div key={props.key} style={props.style} className="chathistory-entry justify-content-start">
                    {(item.type === ChatEntryType.TYPE_CHAT) &&
                    <div className={`p-1 d-flex gap-1 ${isDark ? 'dark' : 'light'}`}>
                        <div className="text-muted">{item.timestamp}</div>
                        <div className="cursor-pointer d-flex text-nowrap" dangerouslySetInnerHTML={ { __html: (item.name + ':') }} />
                        <div className="text-break text-wrap flex-grow-1">{item.message}</div>
                    </div>
                    }
                    {(item.type === ChatEntryType.TYPE_ROOM_INFO) &&
                    <div className={`p-1 d-flex gap-1 ${isDark ? 'dark' : 'light'}`}>
                        <div className="text-muted">{item.timestamp}</div>
                        <i className="icon icon-small-room" />
                        <div className="cursor-pointer text-break text-wrap">{item.name}</div>
                    </div>
                    }
                    
                </div>
            </CellMeasurer>
        );
    };

    const onResize = useCallback((info: Size) =>
    {
        cache.clearAll();
    }, [cache]);

    const onRowsRendered = useCallback((info: RenderedRows) =>
    {
        if(elementRef && elementRef.current && isVisible && needsScroll)
        {
            console.log('stop ' + info.stopIndex);
            //if(chatHistoryState.chats.length > 0) elementRef.current.measureAllRows();
            elementRef.current.scrollToRow(chatHistoryState.chats.length);
            console.log('scroll')
            setNeedsScroll(false);
        }
    }, [chatHistoryState.chats.length, isVisible, needsScroll]);

    useEffect(() =>
    {
        
        if(elementRef && elementRef.current && isVisible)
        {
            //if(chatHistoryState.chats.length > 0) elementRef.current.measureAllRows();
            elementRef.current.scrollToRow(chatHistoryState.chats.length);
        }
        //console.log(chatHistoryState.chats.length);
        
       setNeedsScroll(true);
    }, [chatHistoryState.chats, isVisible, chatHistoryUpdateId]);

    return (
        <ChatHistoryContextProvider value={ { chatHistoryState, roomHistoryState } }>
            <ChatHistoryMessageHandler />
            {isVisible &&
            <NitroCardView uniqueKey="chat-history" className="nitro-chat-history" simple={ false } theme={'dark'} >
                <NitroCardHeaderView headerText={ 'Chat History' } onCloseClick={ event => setIsVisible(false) } theme={'dark'}/>
                <NitroCardContentView className="chat-history-content p-0" theme={'dark'}>
                    <div className="row w-100 h-100 chat-history-container">
                            <AutoSizer defaultWidth={300} defaultHeight={200} onResize={onResize}>
                                {({ height, width }) => 
                                {
                                    return (
                                        <List
                                            ref={elementRef}
                                            width={width}
                                            height={height}
                                            rowCount={chatHistoryState.chats.length}
                                            rowHeight={cache.rowHeight}
                                            className={'chat-history-list'}
                                            rowRenderer={RowRenderer}
                                            onRowsRendered={onRowsRendered}
                                            deferredMeasurementCache={cache}
                                        />
                                    )
                                }
                                }
                            </AutoSizer>
                        </div>
                </NitroCardContentView>
            </NitroCardView>
            }
        </ChatHistoryContextProvider>
    );
}
