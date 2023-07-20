import { GetRoomVisitsMessageComposer, RoomVisitsData, RoomVisitsEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Base, Column, DraggableWindowPosition, Grid, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface ModToolsUserRoomVisitsViewProps
{
    userId: number;
    onCloseClick: () => void;
}

export const ModToolsUserRoomVisitsView: FC<ModToolsUserRoomVisitsViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [ roomVisitData, setRoomVisitData ] = useState<RoomVisitsData>(null);

    useMessageEvent<RoomVisitsEvent>(RoomVisitsEvent, event =>
    {
        const parser = event.getParser();

        if(parser.data.userId !== userId) return;

        setRoomVisitData(parser.data);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomVisitsMessageComposer(userId));
    }, [ userId ]);

    if(!userId) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-visits" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ 'User Visits' } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black" gap={ 1 }>
                <Column fullHeight gap={ 0 } overflow="hidden">
                    <Column gap={ 2 }>
                        <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                            <Base className="g-col-2">Time</Base>
                            <Base className="g-col-7">Room name</Base>
                            <Base className="g-col-3">Visit</Base>
                        </Grid>
                    </Column>
                    <InfiniteScroll rows={ roomVisitData?.rooms ?? [] } rowRender={ row =>
                    {
                        return (
                            <Grid fullHeight={ false } gap={ 1 } alignItems="center" className="text-black py-1 border-bottom">
                                <Text className="g-col-2">{ row.enterHour.toString().padStart(2, '0') }: { row.enterMinute.toString().padStart(2, '0') }</Text>
                                <Text className="g-col-7">{ row.roomName }</Text>
                                <Text bold underline pointer variant="primary" className="g-col-3" onClick={ event => TryVisitRoom(row.roomId) }>Visit Room</Text>
                            </Grid>
                        );
                    } } />
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
