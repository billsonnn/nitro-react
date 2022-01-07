import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Column } from '../../../../../../common/Column';
import { Flex } from '../../../../../../common/Flex';
import { Text } from '../../../../../../common/Text';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsAccessTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const roomSettings = Object.assign({}, roomSettingsData);

        let save = true;

        switch(field)
        {
            case 'lock_state':
                roomSettings.lockState = Number(value);

                if(Number(value) === 3) save = false;
                break;
            case 'password':
                roomSettings.password = String(value);
                save = false;
                break;
            case 'confirm_password':
                roomSettings.confirmPassword = String(value);
                save = false;
                break;
            case 'allow_pets':
                roomSettings.allowPets = Boolean(value);
                break;
            case 'allow_pets_eat':
                roomSettings.allowPetsEat = Boolean(value);
                break;
        }

        setRoomSettingsData(roomSettings);

        if(save) onSave(roomSettings);
    }, [ roomSettingsData, setRoomSettingsData, onSave ]);

    const isPasswordValid = useCallback(() =>
    {
        return (roomSettingsData.password && (roomSettingsData.password.length > 0) && (roomSettingsData.password === roomSettingsData.confirmPassword));
    }, [ roomSettingsData ]);

    const trySave = useCallback(() =>
    {
        if(isPasswordValid()) onSave(roomSettingsData);
    }, [isPasswordValid, onSave, roomSettingsData]);

    return (
        <>
            <Text bold>{LocalizeText('navigator.roomsettings.roomaccess.caption')}</Text>
            <Text>{ LocalizeText('navigator.roomsettings.roomaccess.info') }</Text>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.doormode') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 0 } onChange={ (e) => handleChange('lock_state', 0) } />
                    <Text>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 1 } onChange={ (e) => handleChange('lock_state', 1) } />
                    <Text>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 2 } onChange={ (e) => handleChange('lock_state', 2) } />
                    <Text>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                </Flex>
                <Flex fullWidth gap={ 1 }>
                    <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 3 } onChange={ (e) => handleChange('lock_state', 3) } />
                    { (roomSettingsData.lockState !== 3) && <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                    { roomSettingsData.lockState === 3 &&
                        <Column gap={ 1 }>
                            <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text>
                            <input type="password" className="form-control form-control-sm col-4" value={ roomSettingsData.password ?? '' } onChange={ (e) => handleChange('password', e.target.value) } onBlur={ trySave } placeholder={ LocalizeText('navigator.roomsettings.password') } />
                            <input type="password" className="form-control form-control-sm col-4" value={ roomSettingsData.confirmPassword ?? '' } onChange={ (e) => handleChange('confirm_password', e.target.value) } onBlur={ trySave } placeholder={ LocalizeText('navigator.roomsettings.passwordconfirm') } />
                                { !isPasswordValid() &&
                                    <small className="text-danger fw-bold">
                                        { LocalizeText('navigator.roomsettings.invalidconfirm') }
                                    </small> }
                        </Column> }
                </Flex>
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.pets') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPets } onChange={ (e) => handleChange('allow_pets', e.target.checked) } />
                    <Text>{ LocalizeText('navigator.roomsettings.allowpets') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPetsEat } onChange={ (e) => handleChange('allow_pets_eat', e.target.checked) } />
                    <Text>{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</Text>
                </Flex>
            </Column>
        </>
    );
};
