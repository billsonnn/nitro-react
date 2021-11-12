import { ChatlineData, ChatRecordData, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { TryVisitRoom } from '../../../../api';
import { ModToolsOpenRoomInfoEvent } from '../../../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { ChatlogViewProps } from './ChatlogView.types';

export const ChatlogView: FC<ChatlogViewProps> = props =>
{
    const { records = null } = props;

    const simpleRowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = records[0].chatlog[props.index];

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={props.key}
                parent={props.parent}
                rowIndex={props.index}
            >
                <div key={props.key} style={props.style} className={'row chatlog-entry justify-content-start ' + (item.hasHighlighting ? 'highlighted' : '')}>
                    <div className="col-auto text-center">{item.timestamp}</div>
                    <div className="col-sm-2 justify-content-start username"><span className="fw-bold cursor-pointer" onClick={() => SendMessageHook(new UserProfileComposer(item.userId))}>{item.userName}</span></div>
                    <div className="col justify-content-start h-100"><span className="text-break text-wrap h-100">{item.message}</span></div>
                </div>
            </CellMeasurer>
        );
    };

    const advancedRowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        let chatlogEntry: ChatlineData;
        let currentRecord: ChatRecordData;
        let isRoomInfo = false;

        let totalIndex = 0;
        for(let i = 0; i < records.length; i++)
        {
            currentRecord = records[i];

            totalIndex++; // row for room info
            totalIndex = totalIndex + currentRecord.chatlog.length;

            if(props.index > (totalIndex - 1))
            {
                continue; // it is not in current one
            }
            
            if( (props.index + 1) === (totalIndex - currentRecord.chatlog.length))
            {
                isRoomInfo = true;
                break;
            }
            const index = props.index - (totalIndex - currentRecord.chatlog.length);
            chatlogEntry = currentRecord.chatlog[index];
            break;
        }

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={props.key}
                parent={props.parent}
                rowIndex={props.index}
            >
                {isRoomInfo && <RoomInfo roomId={currentRecord.roomId} roomName={currentRecord.roomName} uniqueKey={props.key} style={props.style}/>}
                {!isRoomInfo &&
                    <div key={props.key} style={props.style} className="row chatlog-entry justify-content-start">
                        <div className="col-auto text-center">{chatlogEntry.timestamp}</div>
                        <div className="col-sm-2 justify-content-start username"><span className="fw-bold cursor-pointer" onClick={() => SendMessageHook(new UserProfileComposer(chatlogEntry.userId))}>{chatlogEntry.userName}</span></div>
                        <div className="col justify-content-start h-100"><span className="text-break text-wrap h-100">{chatlogEntry.message}</span></div>
                    </div>
                }

            </CellMeasurer>
        );
    }

    const getNumRowsForAdvanced = useCallback(() =>
    {
        let count = 0;

        for(let i = 0; i < records.length; i++)
        {
            count++; // add room info row
            count = count + records[i].chatlog.length;
        }

        return count;
    }, [records]);

    const cache = new CellMeasurerCache({
        defaultHeight: 25,
        fixedWidth: true
    });

    const RoomInfo = useCallback(({ roomId, roomName, uniqueKey, style }) =>
    {
        return (
            <div key={uniqueKey} style={style} className="row justify-content-start gap-2 room-info">
                <div className="col-7"><span className="fw-bold">Room: </span>{roomName}</div>
                <button className="btn btn-sm btn-primary col-sm-auto" onClick={() => TryVisitRoom(roomId)}>Visit Room</button>
                <button className="btn btn-sm btn-primary col-sm-auto" onClick={() => dispatchUiEvent(new ModToolsOpenRoomInfoEvent(roomId))}>Room Tools</button>
            </div>
        );
    }, []);

    return (
        <>
            {
                (records && records.length) &&
                <>
                    {(records.length === 1) && <RoomInfo roomId={records[0].roomId} roomName={records[0].roomName} uniqueKey={records[0].roomId} style={{}} />}
                    <div className="chatlog-messages w-100 h-100 overflow-hidden">
                        <div className="row align-items-start w-100">
                            <div className="col-auto text-center fw-bold">Time</div>
                            <div className="col-sm-2 username-label fw-bold">User</div>
                            <div className="col fw-bold">Message</div>
                        </div>
                        <div className="row w-100 h-100 chatlog">
                            <AutoSizer defaultWidth={400} defaultHeight={200}>
                                {({ height, width }) => 
                                {
                                    cache.clearAll();

                                    return (
                                        <List
                                            width={width}
                                            height={height}
                                            rowCount={records.length > 1 ? getNumRowsForAdvanced() : records[0].chatlog.length}
                                            rowHeight={cache.rowHeight}
                                            className={'chatlog-container'}
                                            rowRenderer={records.length > 1 ? advancedRowRenderer : simpleRowRenderer}
                                            deferredMeasurementCache={cache} />
                                    )
                                }
                                }
                            </AutoSizer>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
