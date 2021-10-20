import { ModtoolReceivedRoomsUserEvent, ModtoolRequestUserRoomsComposer, ModtoolRoomVisitedData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AutoSizer, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ModToolsUserRoomVisitsViewProps } from './ModToolsUserRoomVisitsView.types';

export const ModToolsUserRoomVisitsView: FC<ModToolsUserRoomVisitsViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;

    const [roomVisitData, setRoomVisitData] = useState<ModtoolRoomVisitedData>(null);

    useEffect(() =>
    {
        SendMessageHook(new ModtoolRequestUserRoomsComposer(userId));
    }, [userId]);

    const onModtoolReceivedRoomsUserEvent = useCallback((event: ModtoolReceivedRoomsUserEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setRoomVisitData(parser.data);
    }, [userId]);

    CreateMessageHook(ModtoolReceivedRoomsUserEvent, onModtoolReceivedRoomsUserEvent);

    const RowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = roomVisitData.rooms[props.index];

        return (
        <div style={props.style} key={props.key} className="room-visit">
            {item.enterHour}:{item.enterMinute} <b>Room:</b> {item.roomName}
        </div>);
    }

    return (
        <NitroCardView className="nitro-mod-tools-user-visits" simple={true}>
            <NitroCardHeaderView headerText={'User Visits'} onCloseClick={ onCloseClick } />
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
                                rowHeight={25}
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
