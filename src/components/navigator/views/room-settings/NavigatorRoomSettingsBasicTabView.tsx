import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomDeleteComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetMaxVisitorsList, IRoomData, LocalizeText, NotificationUtilities, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';
import { BatchUpdates } from '../../../../hooks';
import { useNavigatorContext } from '../../NavigatorContext';

const ROOM_NAME_MIN_LENGTH = 3;
const ROOM_NAME_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 255;

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
    close: () => void;
}


export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null, close = null } = props;
    const [ roomName, setRoomName ] = useState<string>('');
    const [ roomDescription, setRoomDescription ] = useState<string>('');
    const { categories = null } = useNavigatorContext();

    const deleteRoom = () =>
    {
        NotificationUtilities.confirm(LocalizeText('navigator.roomsettings.deleteroom.confirm.message', [ 'room_name' ], [ roomData.roomName ] ), () =>
        {
            SendMessageComposer(new RoomDeleteComposer(roomData.roomId));

            if(close) close();

            CreateLinkEvent('navigator/search/myworld_view');
        },
        null, null, null, LocalizeText('navigator.roomsettings.deleteroom.confirm.title'));
    }

    const saveRoomName = () =>
    {
        if((roomName === roomData.roomName) || (roomName.length < ROOM_NAME_MIN_LENGTH) || (roomName.length > ROOM_NAME_MAX_LENGTH)) return;

        handleChange('name', roomName);
    }

    const saveRoomDescription = () =>
    {
        if((roomDescription === roomData.roomDescription) || (roomDescription.length > DESC_MAX_LENGTH)) return;

        handleChange('description', roomDescription);
    } 

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setRoomName(roomData.roomName);
            setRoomDescription(roomData.roomDescription);
        });
    }, [ roomData ]);

    return (
        <>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomname') }</Text>
                <Column fullWidth gap={ 0 }>
                    <input className="form-control form-control-sm" value={ roomName } maxLength={ ROOM_NAME_MAX_LENGTH } onChange={ event => setRoomName(event.target.value) } onBlur={ saveRoomName } />
                    { (roomName.length < ROOM_NAME_MIN_LENGTH) &&
                        <Text bold small variant="danger">
                            { LocalizeText('navigator.roomsettings.roomnameismandatory') }
                        </Text> }
                </Column>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomsettings.desc') }</Text>
                <textarea className="form-control form-control-sm" value={ roomDescription } maxLength={ DESC_MAX_LENGTH } onChange={ event => setRoomDescription(event.target.value) } onBlur={ saveRoomDescription } />
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.category') }</Text>
                <select className="form-select form-select-sm" value={ roomData.categoryId } onChange={ event => handleChange('category', event.target.value) }>
                    { categories && categories.map(category => <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>) }
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.maxvisitors') }</Text>
                <select className="form-select form-select-sm" value={ roomData.userCount } onChange={ event => handleChange('max_visitors', event.target.value) }>
                    { GetMaxVisitorsList && GetMaxVisitorsList.map(value => <option key={ value } value={ value }>{ value }</option>) }
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.tradesettings') }</Text>
                <select className="form-select form-select-sm" value={ roomData.tradeState } onChange={ event => handleChange('trade_state', event.target.value) }>
                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Base className="col-3" />
                <input className="form-check-input" type="checkbox" checked={ roomData.allowWalkthrough } onChange={ event => handleChange('allow_walkthrough', event.target.checked) } />
                <Text>{ LocalizeText('navigator.roomsettings.allow_walk_through') }</Text>
            </Flex>
            <Text variant="danger" underline bold pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ deleteRoom }>
                <FontAwesomeIcon icon="times" />
                { LocalizeText('navigator.roomsettings.delete') }
            </Text>
        </>
    );
};
