import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, MouseEvent } from 'react';
import { CreateRoomSession, GetSessionDataManager, TryVisitRoom } from '../../../../api';
import { Flex, FlexProps } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { UpdateDoorStateEvent } from '../../../../events';
import { dispatchUiEvent } from '../../../../hooks';

export interface NavigatorSearchResultItemViewProps extends FlexProps
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
        <Flex pointer onClick={ visitRoom } overflow="hidden" gap={ 2 } { ...rest }>
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
            {/* <div className="d-flex flex-column justify-content-center align-items-center nitro-navigator-result small cursor-pointer" onClick={ visitRoom }>
                <div className="d-flex justify-content-between w-100 px-2 py-1">
                    <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                        <div className={ 'd-flex align-items-center justify-content-center badge p-1 ' + getUserCounterColor() }>
                            <i className="fas fa-user"></i>
                            { roomData.userCount }
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-start flex-grow-1 px-2 overflow-hidden">
                            <span className="d-block text-truncate" style={ { maxWidth: '95%' } }>{ roomData.roomName }</span>
                        </div>
                    </div>
                    <div className="d-flex flex-row-reverse align-items-center">
                        <i className="icon icon-navigator-info" onClick={ openInfo }></i>
                        { roomData.habboGroupId > 0 && <i className="icon icon-navigator-room-group me-2"></i> }
                        { roomData.doorMode !== RoomDataParser.OPEN_STATE && 
                            <i className={ 'me-2 icon icon-navigator-room-' + classNames( { 'locked': roomData.doorMode === RoomDataParser.DOORBELL_STATE, 'password': roomData.doorMode === RoomDataParser.PASSWORD_STATE, 'invisible': roomData.doorMode === RoomDataParser.INVISIBLE_STATE })}></i>
                        }
                    </div>
                </div>
            </div> */}
            { children }
        </Flex>
    );
}
