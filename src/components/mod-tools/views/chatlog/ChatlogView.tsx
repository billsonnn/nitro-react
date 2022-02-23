import { ChatRecordData, UserProfileComposer } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, Key, useCallback } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { TryVisitRoom } from '../../../../api';
import { Base, Button, Column, Flex, Grid, Text } from '../../../../common';
import { ModToolsOpenRoomInfoEvent } from '../../../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { dispatchUiEvent, SendMessageHook } from '../../../../hooks';

interface ChatlogViewProps
{
    records: ChatRecordData[];
}

export const ChatlogView: FC<ChatlogViewProps> = props =>
{
    const { records = null } = props;

    const rowRenderer = (props: ListRowProps) =>
    {
        let chatlogEntry = records[0].chatlog[props.index];

        return (
            <CellMeasurer
                cache={ cache }
                columnIndex={ 0 }
                key={ props.key }
                parent={ props.parent }
                rowIndex={ props.index }
            >
                <Grid key={ props.key } fullHeight={ false } style={ props.style } gap={ 1 } alignItems="center" className="log-entry py-1 border-bottom">
                    <Text className="g-col-2">{ chatlogEntry.timestamp }</Text>
                    <Text className="g-col-3" bold underline pointer onClick={ event => SendMessageHook(new UserProfileComposer(chatlogEntry.userId)) }>{ chatlogEntry.userName }</Text>
                    <Text textBreak wrap className="g-col-7">{ chatlogEntry.message }</Text>
                </Grid>
            </CellMeasurer>
        );
    };

    const advancedRowRenderer = (props: ListRowProps) =>
    {
        let chatlogEntry = null;
        let currentRecord: ChatRecordData = null;
        let isRoomInfo = false;
        let totalIndex = 0;

        for(let i = 0; i < records.length; i++)
        {
            currentRecord = records[i];

            totalIndex++; // row for room info
            totalIndex = (totalIndex + currentRecord.chatlog.length);

            if(props.index > (totalIndex - 1)) continue;
            
            if((props.index + 1) === (totalIndex - currentRecord.chatlog.length))
            {
                isRoomInfo = true;

                break;
            }

            const index = (props.index - (totalIndex - currentRecord.chatlog.length));

            chatlogEntry = currentRecord.chatlog[index];

            break;
        }

        return (
            <CellMeasurer
                cache={ cache }
                columnIndex={ 0 }
                key={ props.key }
                parent={ props.parent }
                rowIndex={ props.index }
            >
                { (isRoomInfo && currentRecord) &&
                    <RoomInfo roomId={ currentRecord.roomId } roomName={ currentRecord.roomName } uniqueKey={ props.key } style={ props.style } /> }
                { !isRoomInfo &&
                    <Grid key={ props.key } style={ props.style } gap={ 1 } alignItems="center" className="log-entry py-1 border-bottom">
                        <Text className="g-col-2">{ chatlogEntry.timestamp }</Text>
                        <Text className="g-col-3" bold underline pointer onClick={ event => SendMessageHook(new UserProfileComposer(chatlogEntry.userId)) }>{ chatlogEntry.userName }</Text>
                        <Text textBreak wrap className="g-col-7">{ chatlogEntry.message }</Text>
                    </Grid> }
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

    const RoomInfo = (props: { roomId: number, roomName: string, uniqueKey: Key, style: CSSProperties }) =>
    {
        return (
            <Flex key={ props.uniqueKey } gap={ 2 } alignItems="center" justifyContent="between" className="room-info bg-muted rounded p-1" style={ props.style }>
                <Flex gap={ 1 }>
                    <Text bold>Room name:</Text>
                    <Text>{ props.roomName }</Text>
                </Flex>
                <Flex gap={ 1 }>
                    <Button onClick={ event => TryVisitRoom(props.roomId) }>Visit Room</Button>
                    <Button onClick={ event => dispatchUiEvent(new ModToolsOpenRoomInfoEvent(props.roomId)) }>Room Tools</Button>
                </Flex>
            </Flex>
        );
    }

    const cache = new CellMeasurerCache({
        defaultHeight: 25,
        fixedWidth: true
    });

    return (
        <>
            { (records && (records.length === 1)) &&
                <RoomInfo roomId={records[0].roomId} roomName={records[0].roomName} uniqueKey={ null } style={ {} } /> }
            <Column fit gap={ 0 } overflow="hidden">
                <Column gap={ 2 }>
                    <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                        <Base className="g-col-2">Time</Base>
                        <Base className="g-col-3">User</Base>
                        <Base className="g-col-7">Message</Base>
                    </Grid>
                </Column>
                { (records && (records.length > 0)) &&
                    <Column className="log-container striped-children" overflow="auto" gap={ 0 }>
                        <AutoSizer defaultWidth={ 400 } defaultHeight={ 200 }>
                            { ({ height, width }) => 
                                {
                                    cache.clearAll();

                                    return (
                                        <List
                                            width={ width }
                                            height={ height }
                                            rowCount={ (records.length > 1) ? getNumRowsForAdvanced() : records[0].chatlog.length }
                                            rowHeight={ cache.rowHeight }
                                            className={ 'log-entry-container' }
                                            rowRenderer={ (records.length > 1) ? advancedRowRenderer : rowRenderer }
                                            deferredMeasurementCache={ cache } />
                                    );
                                } }
                        </AutoSizer>
                    </Column> }
            </Column>
        </>
    );
}
