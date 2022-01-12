import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, MouseEvent } from 'react';
import { CreateRoomSession, GetSessionDataManager, TryVisitRoom } from '../../../../api';
import { Flex } from '../../../../common/Flex';
import { LayoutGridItemProps } from '../../../../common/layout/LayoutGridItem';
import { Text } from '../../../../common/Text';
import { UpdateDoorStateEvent } from '../../../../events';
import { dispatchUiEvent } from '../../../../hooks';

export interface NavigatorSearchResultItemViewProps extends LayoutGridItemProps
{
    roomData: RoomDataParser
}

export const NavigatorSearchResultItemView: FC<NavigatorSearchResultItemViewProps> = props =>
{
    const { roomData = null, children = null, ...rest } = props;

    function getUserCounterColor(): string
    {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount));

        let bg = 'bg-primary';

        if(num >= 92)
        {
            bg = 'bg-danger';
        }
        else if(num >= 50)
        {
            bg = 'bg-warning';
        }
        else if(num > 0)
        {
            bg = 'bg-success';
        }

        return bg;
    }

    function openInfo(event: MouseEvent): void
    {
        event.stopPropagation();
        console.log('info');
    }

    function visitRoom(): void
    {
        if(roomData.ownerId !== GetSessionDataManager().userId)
        {
            if(roomData.habboGroupId !== 0)
            {
                TryVisitRoom(roomData.roomId);

                return;
            }

            switch(roomData.doorMode)
            {
                case RoomDataParser.DOORBELL_STATE:
                    dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_DOORBELL, roomData));
                    return;
                case RoomDataParser.PASSWORD_STATE:
                    dispatchUiEvent(new UpdateDoorStateEvent(UpdateDoorStateEvent.START_PASSWORD, roomData));
                    return;
            }
        }
        
        CreateRoomSession(roomData.roomId);
    }

    return (
        <Flex pointer overflow="hidden" alignItems="center" onClick={ visitRoom } gap={ 2 } className="navigator-item px-2 py-1 small" { ...rest }>
            <Flex center className={ 'badge p-1 ' + getUserCounterColor() } gap={ 1 }>
                <FontAwesomeIcon icon="user" />
                { roomData.userCount }
            </Flex>
            <Text truncate className="flex-grow-1">{ roomData.roomName }</Text>
            <Flex reverse alignItems="center" gap={ 1 }>
                <i className="icon icon-navigator-info" onClick={ openInfo } />
                { roomData.habboGroupId > 0 && <i className="icon icon-navigator-room-group" /> }
                { (roomData.doorMode !== RoomDataParser.OPEN_STATE) && 
                    <i className={ ('icon icon-navigator-room-' + ((roomData.doorMode === RoomDataParser.DOORBELL_STATE) ? 'locked' : (roomData.doorMode === RoomDataParser.PASSWORD_STATE) ? 'password' : (roomData.doorMode === RoomDataParser.INVISIBLE_STATE) ? 'invisible' : '')) } /> }
            </Flex>
            { children }
        </Flex>
    );
}
