import { ChatRecordData } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { CreateLinkEvent, TryVisitRoom } from '../../../../api';
import { Base, Button, Column, Flex, Grid, InfiniteScroll, Text } from '../../../../common';
import { useModTools } from '../../../../hooks';
import { ChatlogRecord } from './ChatlogRecord';

interface ChatlogViewProps
{
    records: ChatRecordData[];
}

export const ChatlogView: FC<ChatlogViewProps> = props =>
{
    const { records = null } = props;
    const { openRoomInfo = null } = useModTools();

    const allRecords = useMemo(() =>
    {
        const results: ChatlogRecord[] = [];

        records.forEach(record =>
        {
            results.push({
                isRoomInfo: true,
                roomId: record.roomId,
                roomName: record.roomName
            });

            record.chatlog.forEach(chatlog =>
            {
                results.push({
                    timestamp: chatlog.timestamp,
                    habboId: chatlog.userId,
                    username: chatlog.userName,
                    hasHighlighting: chatlog.hasHighlighting,
                    message: chatlog.message,
                    isRoomInfo: false
                });
            });
        });
        
        return results;
    }, [ records ]);

    const RoomInfo = (props: { roomId: number, roomName: string }) =>
    {
        return (
            <Flex gap={ 2 } alignItems="center" justifyContent="between" className="bg-muted rounded p-1">
                <Flex gap={ 1 }>
                    <Text bold>Room name:</Text>
                    <Text>{ props.roomName }</Text>
                </Flex>
                <Flex gap={ 1 }>
                    <Button onClick={ event => TryVisitRoom(props.roomId) }>Visit Room</Button>
                    <Button onClick={ event => openRoomInfo(props.roomId) }>Room Tools</Button>
                </Flex>
            </Flex>
        );
    }

    return (
        <>
            <Column fit gap={ 0 } overflow="hidden">
                <Column gap={ 2 }>
                    <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                        <Base className="g-col-2">Time</Base>
                        <Base className="g-col-3">User</Base>
                        <Base className="g-col-7">Message</Base>
                    </Grid>
                </Column>
                { (records && (records.length > 0)) &&
                    <InfiniteScroll rows={ allRecords } rowRender={ (row: ChatlogRecord) =>
                    {
                        return (
                            <>
                                { row.isRoomInfo &&
                                    <RoomInfo roomId={ row.roomId } roomName={ row.roomName } /> }
                                { !row.isRoomInfo &&
                                    <Grid fullHeight={ false } gap={ 1 } alignItems="center" className="log-entry py-1 border-bottom">
                                        <Text className="g-col-2">{ row.timestamp }</Text>
                                        <Text className="g-col-3" bold underline pointer onClick={ event => CreateLinkEvent(`mod-tools/open-user-info/${ row.habboId }`) }>{ row.username }</Text>
                                        <Text textBreak wrap className="g-col-7">{ row.message }</Text>
                                    </Grid> }
                            </>
                        );
                    } } /> }
            </Column>
        </>
    );
}
