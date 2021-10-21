import { GetRoomVisitsMessageComposer, RoomVisitsData, RoomVisitsEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AutoSizer, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { TryVisitRoom } from '../../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ModToolsUserRoomVisitsViewProps } from './ModToolsUserRoomVisitsView.types';

export const ModToolsUserRoomVisitsView: FC<ModToolsUserRoomVisitsViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;

    const [roomVisitData, setRoomVisitData] = useState<RoomVisitsData>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetRoomVisitsMessageComposer(userId));
    }, [userId]);

    const onModtoolReceivedRoomsUserEvent = useCallback((event: RoomVisitsEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setRoomVisitData(parser.data);
    }, [userId]);

    CreateMessageHook(RoomVisitsEvent, onModtoolReceivedRoomsUserEvent);

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = roomVisitData.rooms[props.index];

        return (
            <div style={props.style} key={props.key} className="row room-visit">
                <div className="col-auto text-center">{item.enterHour.toString().padStart(2, '0')}:{item.enterMinute.toString().padStart(2, '0')}</div>
                <div className="col-7"><span className="fw-bold">Room: </span>{item.roomName}</div>
                <button className="btn btn-sm btn-link col-sm-auto fw-bold" onClick={() => TryVisitRoom(item.roomId)}>Visit Room</button>
            </div>);
    }

    return (
        <NitroCardView className="nitro-mod-tools-user-visits" simple={true}>
            <NitroCardHeaderView headerText={'User Visits'} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                {roomVisitData &&
                    <div className="row h-100 w-100 user-visits">
                        <AutoSizer defaultWidth={400} defaultHeight={200}>
                            {({ height, width }) => 
                            {
                                return (
                                    <List
                                        width={width}
                                        height={height}
                                        rowCount={roomVisitData.rooms.length}
                                        rowHeight={30}
                                        className={'roomvisits-container'}
                                        rowRenderer={RowRenderer}
                                    />
                                )
                            }}
                        </AutoSizer>
                    </div>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
