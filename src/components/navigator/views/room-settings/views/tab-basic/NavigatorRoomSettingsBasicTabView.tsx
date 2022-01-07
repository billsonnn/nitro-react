import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Base } from '../../../../../../common/Base';
import { Flex } from '../../../../../../common/Flex';
import { Text } from '../../../../../../common/Text';
import { GetMaxVisitorsList } from '../../../../common/RoomSettingsUtils';
import { useNavigatorContext } from '../../../../context/NavigatorContext';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

const DESC_MAX_LENGTH = 255;

export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;
    const [ maxVisitorsList, setMaxVisitorsList ] = useState(GetMaxVisitorsList());
    const { navigatorState = null } = useNavigatorContext();
    const { categories = null } = navigatorState;

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const roomSettings = Object.assign({}, roomSettingsData);

        let save = true;

        switch(field)
        {
            case 'name':
                roomSettings.roomName = String(value);
                save = false;
                break;
            case 'description':
                roomSettings.roomDescription = String(value);
                save = false;
                break;
            case 'category':
                roomSettings.categoryId =  Number(value);
                break;
            case 'max_visitors': 
                roomSettings.userCount = Number(value);
                break;
            case 'trade_state':
                roomSettings.tradeState =  Number(value);
                break;
            case 'allow_walkthrough':
                roomSettings.allowWalkthrough = Boolean(value);
                break;
        }

        setRoomSettingsData(roomSettings);

        if(save) onSave(roomSettings);
    }, [ roomSettingsData, setRoomSettingsData, onSave ]);

    return (
        <>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomname') }</Text>
                <input className="form-control form-control-sm" value={ roomSettingsData.roomName } onChange={ event => handleChange('name', event.target.value) } onBlur={ () => onSave(roomSettingsData) } />
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Text className="col-3">{ LocalizeText('navigator.roomsettings.desc') }</Text>
                <textarea className="form-control form-control-sm" value={ roomSettingsData.roomDescription } onChange={ event => handleChange('description', event.target.value) } onBlur={ () => onSave(roomSettingsData) } maxLength={ DESC_MAX_LENGTH } />
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
            <Text variant="danger" underline bold pointer className="d-flex justify-content-center align-items-center gap-1 mt-2">
                <FontAwesomeIcon icon="times" />
                { LocalizeText('navigator.roomsettings.delete') }
            </Text>
        </>
    );
};
