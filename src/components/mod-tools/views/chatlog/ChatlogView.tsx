import { ChatRecordData, CreateLinkEvent } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { TryVisitRoom } from '../../../../api';
import { Button, Column, Flex, Grid, InfiniteScroll, Text } from '../../../../common';
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
            <Flex alignItems="center" className="bg-muted rounded p-1" gap={ 2 } justifyContent="between">
                <div className="flex gap-1">
                    <Text bold>Room name:</Text>
                    <Text>{ props.roomName }</Text>
                </div>
                <div className="flex gap-1">
                    <Button onClick={ event => TryVisitRoom(props.roomId) }>Visit Room</Button>
                    <Button onClick={ event => openRoomInfo(props.roomId) }>Room Tools</Button>
                </div>
            </Flex>
        );
    };

    return (
        <>
            <Column fit gap={ 0 } overflow="hidden">
                <Column gap={ 2 }>
                    <Grid className="text-black font-bold	 border-bottom pb-1" gap={ 1 }>
                        <div className="col-span-2">Time</div>
                        <div className="col-span-3">User</div>
                        <div className="col-span-7">Message</div>
                    </Grid>
                </Column>
                { (records && (records.length > 0)) &&
                    <InfiniteScroll rowRender={ (row: ChatlogRecord) =>
                    {
                        return (
                            <>
                                { row.isRoomInfo &&
                                    <RoomInfo roomId={ row.roomId } roomName={ row.roomName } /> }
                                { !row.isRoomInfo &&
                                    <Grid alignItems="center" className="log-entry py-1 border-bottom" fullHeight={ false } gap={ 1 }>
                                        <Text className="col-span-2">{ row.timestamp }</Text>
                                        <Text bold pointer underline className="col-span-3" onClick={ event => CreateLinkEvent(`mod-tools/open-user-info/${ row.habboId }`) }>{ row.username }</Text>
                                        <Text textBreak wrap className="col-span-7">{ row.message }</Text>
                                    </Grid> }
                            </>
                        );
                    } } rows={ allRecords } /> }
            </Column>
        </>
    );
};
