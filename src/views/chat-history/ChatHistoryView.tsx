import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer, Size } from 'react-virtualized';
import { ChatHistoryEvent } from '../../events/chat-history/ChatHistoryEvent';
import { useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ChatHistoryMessageHandler } from './ChatHistoryMessageHandler';
import { ChatHistoryContextProvider } from './context/ChatHistoryContext';
import { ChatEntryType } from './context/ChatHistoryContext.types';
import { ChatHistoryState } from './utils/ChatHistoryState';
import { RoomHistoryState } from './utils/RoomHistoryState';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ chatHistoryUpdateId, setChatHistoryUpdateId ] = useState(-1);
    const [ roomHistoryUpdateId, setRoomHistoryUpdateId ] = useState(-1);
    const [ chatHistoryState, setChatHistoryState ] = useState(new ChatHistoryState());
    const [ roomHistoryState, setRoomHistoryState ] = useState(new RoomHistoryState());
    const elementRef = useRef<List>(null);

    useEffect(() =>
    {
        const chatState = new ChatHistoryState();
        const roomState = new RoomHistoryState();

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
            case ChatHistoryEvent.CHAT_HISTORY_CHANGED:
                break;
        }
    }, [isVisible]);

    useUiEvent(ChatHistoryEvent.HIDE_CHAT_HISTORY, onChatHistoryEvent);
    useUiEvent(ChatHistoryEvent.SHOW_CHAT_HISTORY, onChatHistoryEvent);
    useUiEvent(ChatHistoryEvent.TOGGLE_CHAT_HISTORY, onChatHistoryEvent);
    useUiEvent(ChatHistoryEvent.CHAT_HISTORY_CHANGED, onChatHistoryEvent);

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
        console.log(props.index);
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={props.key}
                parent={props.parent}
                rowIndex={props.index}
            >
                <div key={props.key} style={props.style} className="row chathistory-entry justify-content-start">
                    {(item.type === ChatEntryType.TYPE_CHAT) &&
                    <>
                        <div className="col-auto text-center">{item.timestamp}</div>
                        <div className="col-auto justify-content-start username">
                            <span className="fw-bold cursor-pointer" dangerouslySetInnerHTML={ { __html: item.name }} />
                        </div>
                        <div className="col justify-content-start h-100">
                            <span className="text-break text-wrap h-100">{item.message}</span>
                        </div>
                    </>
                    }
                    {(item.type === ChatEntryType.TYPE_ROOM_INFO) &&
                    <>
                        <div className="col-auto text-center">{item.timestamp}</div>
                        <div className="col-auto justify-content-start username">
                            <span className="fw-bold cursor-pointer">{item.name}</span>
                        </div>
                        <div className="col justify-content-start h-100">
                            <span className="text-break text-wrap h-100">{item.message}</span>
                        </div>
                    </>
                    }
                    
                </div>
            </CellMeasurer>
        );
    };

    const onResize = useCallback((info: Size) =>
    {
        cache.clearAll();
    }, [cache]);

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible)
        {
            //elementRef.current.measureAllRows();
            elementRef.current.scrollToRow(chatHistoryState.chats.length - 1);
        }
        //console.log(chatHistoryState.chats.length);
    }, [chatHistoryState.chats, isVisible, chatHistoryUpdateId])

    return (
        <ChatHistoryContextProvider value={ { chatHistoryState, roomHistoryState } }>
            <ChatHistoryMessageHandler />
            {isVisible &&
            <NitroCardView uniqueKey="chat-history" className="nitro-chat-history" simple={ false }>
                <NitroCardHeaderView headerText={ 'Chat History' } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView className="chat-history-content" style={{ backgroundColor: '#1C323F !important' }}>
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
