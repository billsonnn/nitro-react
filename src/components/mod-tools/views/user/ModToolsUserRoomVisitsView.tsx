import { GetRoomVisitsMessageComposer, RoomVisitsData, RoomVisitsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Base, Column, DraggableWindowPosition, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { UseMessageEventHook } from '../../../../hooks';

interface ModToolsUserRoomVisitsViewProps
{
    userId: number;
    onCloseClick: () => void;
}

export const ModToolsUserRoomVisitsView: FC<ModToolsUserRoomVisitsViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [ roomVisitData, setRoomVisitData ] = useState<RoomVisitsData>(null);

    const onModtoolReceivedRoomsUserEvent = useCallback((event: RoomVisitsEvent) =>
    {
        const parser = event.getParser();

        if(!parser || (parser.data.userId !== userId)) return;

        setRoomVisitData(parser.data);
    }, [ userId ]);

    UseMessageEventHook(RoomVisitsEvent, onModtoolReceivedRoomsUserEvent);

    const RowRenderer = (props: ListRowProps) =>
    {
        const item = roomVisitData.rooms[props.index];

        return (
            <Grid key={ props.key } fullHeight={ false } style={ props.style } gap={ 1 } alignItems="center" className="text-black py-1 border-bottom">
                <Text className="g-col-2">{ item.enterHour.toString().padStart(2, '0') }: { item.enterMinute.toString().padStart(2, '0') }</Text>
                <Text className="g-col-7">{ item.roomName }</Text>
                <Text bold underline pointer variant="primary" className="g-col-3" onClick={ event => TryVisitRoom(item.roomId) }>Visit Room</Text>
            </Grid>
        );
    }

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomVisitsMessageComposer(userId));
    }, [userId]);

    if(!userId) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-visits" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT}>
            <NitroCardHeaderView headerText={ 'User Visits' } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black" gap={ 1 }>
                <Column gap={ 0 } overflow="hidden">
                    <Column gap={ 2 }>
                        <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                            <Base className="g-col-2">Time</Base>
                            <Base className="g-col-7">Room name</Base>
                            <Base className="g-col-3">Visit</Base>
                        </Grid>
                    </Column>
                    <Column className="log-container striped-children" overflow="auto" gap={ 0 }>
                        { roomVisitData &&
                            <AutoSizer defaultWidth={ 400 } defaultHeight={ 200 }>
                                { ({ height, width }) => 
                                    {
                                        return (
                                            <List
                                                width={ width }
                                                height={ height }
                                                rowCount={ roomVisitData.rooms.length }
                                                rowHeight={ 25 }
                                                className={'log-entry-container' }
                                                rowRenderer={ RowRenderer }
                                            />
                                        );
                                    } }
                            </AutoSizer> }
                    </Column>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
