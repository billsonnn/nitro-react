import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import RoomSettingsData from '../../common/RoomSettingsData';

interface NavigatorRoomSettingsTabViewProps
{
    roomSettingsData: RoomSettingsData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsAccessTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, handleChange = null } = props;

    const isPasswordValid = useCallback(() =>
    {
        return (roomSettingsData.password && (roomSettingsData.password.length > 0) && (roomSettingsData.password === roomSettingsData.confirmPassword));
    }, [ roomSettingsData ]);

    const trySave = useCallback(() =>
    {
        if(isPasswordValid()) handleChange('save', null);
    }, [ isPasswordValid, handleChange ]);

    return (
        <>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.roomaccess.caption') }</Text>
                <Text>{ LocalizeText('navigator.roomsettings.roomaccess.info') }</Text>
            </Column>
            <Column overflow="auto">
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('navigator.roomsettings.doormode') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === RoomDataParser.OPEN_STATE) } onChange={ event => handleChange('lock_state', RoomDataParser.OPEN_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === RoomDataParser.DOORBELL_STATE) } onChange={ event => handleChange('lock_state', RoomDataParser.DOORBELL_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === RoomDataParser.INVISIBLE_STATE) } onChange={ event => handleChange('lock_state', RoomDataParser.INVISIBLE_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                    </Flex>
                    <Flex fullWidth gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === RoomDataParser.PASSWORD_STATE) } onChange={ event => handleChange('lock_state', RoomDataParser.PASSWORD_STATE) } />
                        { (roomSettingsData.lockState !== RoomDataParser.PASSWORD_STATE) &&
                            <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                        { (roomSettingsData.lockState === RoomDataParser.PASSWORD_STATE) &&
                            <Column gap={ 1 }>
                                <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text>
                                <input type="password" className="form-control form-control-sm col-4" value={ roomSettingsData.password ?? '' } onChange={ (e) => handleChange('password', e.target.value) } onBlur={ trySave } placeholder={ LocalizeText('navigator.roomsettings.password') } />
                                <input type="password" className="form-control form-control-sm col-4" value={ roomSettingsData.confirmPassword ?? '' } onChange={ (e) => handleChange('confirm_password', e.target.value) } onBlur={ trySave } placeholder={ LocalizeText('navigator.roomsettings.passwordconfirm') } />
                                { !isPasswordValid() &&
                                    <Text bold small variant="danger">
                                        { LocalizeText('navigator.roomsettings.invalidconfirm') }
                                    </Text> }
                            </Column> }
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('navigator.roomsettings.pets') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPets } onChange={ event => handleChange('allow_pets', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowpets') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPetsEat } onChange={ event => handleChange('allow_pets_eat', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</Text>
                    </Flex>
                </Column>
            </Column>
        </>
    );
};
