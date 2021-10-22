import { FC, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { ChatHistoryEvent } from '../../events/chat-history/ChatHistoryEvent';
import { useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ChatHistoryMessageHandler } from './ChatHistoryMessageHandler';
import { ChatHistoryContextProvider } from './context/ChatHistoryContext';
import { ChatEntryType, ChatHistoryReducer, initialChatHistory } from './reducers/ChatHistoryReducer';

export const ChatHistoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ chatHistoryState, dispatchChatHistoryState ] = useReducer(ChatHistoryReducer, initialChatHistory);
    const { chats = null } = chatHistoryState;
    const elementRef = useRef<List>(null);

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

    const cache = new CellMeasurerCache({
        defaultHeight: 25,
        fixedWidth: true
    });

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = chats[props.index];

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={props.key}
                parent={props.parent}
                rowIndex={props.index}
            >
                <div key={props.key} style={props.style} className="row chatlog-entry justify-content-start">
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

    useEffect(() =>
    {
        if(elementRef && elementRef.current && isVisible)
        {
            elementRef.current.scrollToRow(chats.length - 1);
        }
        console.log(chats.length);
    }, [chats, isVisible])

    return (
        <ChatHistoryContextProvider value={ { chatHistoryState, dispatchChatHistoryState } }>
            <ChatHistoryMessageHandler />
            {isVisible &&
            <NitroCardView uniqueKey="chat-history" className="nitro-chat-history" simple={ false }>
                <NitroCardHeaderView headerText={ 'Chat History' } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView className="chat-history-content" style={{ backgroundColor: '#1C323F !important' }}>
                    <div className="row w-100 h-100 chat-history-container">
                            <AutoSizer defaultWidth={250} defaultHeight={200}>
                                {({ height, width }) => 
                                {
                                    cache.clearAll();
                                    
                                    return (
                                        <List
                                            ref={elementRef}
                                            width={width}
                                            height={height}
                                            rowCount={chats.length}
                                            rowHeight={cache.rowHeight}
                                            className={'chat-history-list'}
                                            rowRenderer={RowRenderer}
                                            deferredMeasurementCache={cache} />
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
