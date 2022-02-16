import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../api';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Text } from '../../../../../common/Text';
import { NavigatorRoomSettingsTabViewProps } from './NavigatorRoomSettingsTabViewProps.types';

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
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === 0) } onChange={ event => handleChange('lock_state', 0) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === 1) } onChange={ event => handleChange('lock_state', 1) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === 2) } onChange={ event => handleChange('lock_state', 2) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                    </Flex>
                    <Flex fullWidth gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomSettingsData.lockState === 3) } onChange={ event => handleChange('lock_state', 3) } />
                        { (roomSettingsData.lockState !== 3) &&
                            <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                        { (roomSettingsData.lockState === 3) &&
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
