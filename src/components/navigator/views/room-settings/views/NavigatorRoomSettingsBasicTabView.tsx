import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomDeleteComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, LocalizeText, NotificationUtilities, SendMessageComposer } from '../../../../../api';
import { Base, Flex, Text } from '../../../../../common';
import RoomSettingsData from '../../../common/RoomSettingsData';
import { GetMaxVisitorsList } from '../../../common/RoomSettingsUtils';
import { useNavigatorContext } from '../../../NavigatorContext';

const DESC_MAX_LENGTH = 255;

interface NavigatorRoomSettingsTabViewProps
{
    roomSettingsData: RoomSettingsData;
    handleChange: (field: string, value: string | number | boolean) => void;
    close: () => void;
}


export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, handleChange = null, close = null } = props;
    const [ maxVisitorsList, setMaxVisitorsList ] = useState(GetMaxVisitorsList());
    const { navigatorState = null } = useNavigatorContext();
    const { categories = null } = navigatorState;

    const deleteRoom = () =>
    {
        NotificationUtilities.confirm(LocalizeText('navigator.roomsettings.deleteroom.confirm.message'), () =>
        {
            SendMessageComposer(new RoomDeleteComposer(roomSettingsData.roomId));

            if(close) close();

            CreateLinkEvent('navigator/search/myworld_view');
        },
        null, null, null, LocalizeText('navigator.roomsettings.deleteroom.confirm.title'));
    }

    return (
        <>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomname') }</Text>
                <input className="form-control form-control-sm" value={ roomSettingsData.roomName } onChange={ event => handleChange('name', event.target.value) } onBlur={ event => handleChange('save', null) } />
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomsettings.desc') }</Text>
                <textarea className="form-control form-control-sm" value={ roomSettingsData.roomDescription } onChange={ event => handleChange('description', event.target.value) } onBlur={ event => handleChange('save', null) } maxLength={ DESC_MAX_LENGTH } />
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.category') }</Text>
                <select className="form-select form-select-sm" value={ roomSettingsData.categoryId } onChange={ event => handleChange('category', event.target.value) }>
                    { categories && categories.map(category =>
                        {
                            return <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>
                        }) }
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.maxvisitors') }</Text>
                <select className="form-select form-select-sm" value={ roomSettingsData.userCount } onChange={ event => handleChange('max_visitors', event.target.value) }>
                    { maxVisitorsList && maxVisitorsList.map(value =>
                        {
                            return <option key={ value } value={ value }>{ value }</option>
                        }) }
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.tradesettings') }</Text>
                <select className="form-select form-select-sm" value={ roomSettingsData.tradeState } onChange={ event => handleChange('trade_state', event.target.value) }>
                    <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                    <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                    <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                </select>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Base className="col-3" />
                <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowWalkthrough } onChange={ event => handleChange('allow_walkthrough', event.target.checked) } />
                <Text>{ LocalizeText('navigator.roomsettings.allow_walk_through') }</Text>
            </Flex>
            <Text variant="danger" underline bold pointer className="d-flex justify-content-center align-items-center gap-1" onClick={ deleteRoom }>
                <FontAwesomeIcon icon="times" />
                { LocalizeText('navigator.roomsettings.delete') }
            </Text>
        </>
    );
};
