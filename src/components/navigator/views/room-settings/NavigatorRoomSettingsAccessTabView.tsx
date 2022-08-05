import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsAccessTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ password, setPassword ] = useState<string>('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ isTryingPassword, setIsTryingPassword ] = useState(false);

    const saveRoomPassword = () =>
    {
        if(!isTryingPassword || ((password.length <= 0) || (confirmPassword.length <= 0) || (password !== confirmPassword))) return;

        handleChange('password', password);
    }

    useEffect(() =>
    {
        setPassword('');
        setConfirmPassword('');
        setIsTryingPassword(false);
    }, [ roomData ]);

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
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.OPEN_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.OPEN_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.DOORBELL_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.DOORBELL_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.INVISIBLE_STATE) && !isTryingPassword } onChange={ event => handleChange('lock_state', RoomDataParser.INVISIBLE_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                    </Flex>
                    <Flex fullWidth gap={ 1 }>
                        <input className="form-check-input" type="radio" name="lockState" checked={ (roomData.lockState === RoomDataParser.PASSWORD_STATE) || isTryingPassword } onChange={ event => setIsTryingPassword(event.target.checked) } />
                        { !isTryingPassword && (roomData.lockState !== RoomDataParser.PASSWORD_STATE) &&
                            <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                        { (isTryingPassword || (roomData.lockState === RoomDataParser.PASSWORD_STATE)) &&
                            <Column gap={ 1 }>
                                <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text>
                                <input type="password" className="form-control form-control-sm col-4" value={ password } onChange={ event => setPassword(event.target.value) } placeholder={ LocalizeText('navigator.roomsettings.password') } onFocus={ event => setIsTryingPassword(true) } />
                                { isTryingPassword && (password.length <= 0) &&
                                    <Text bold small variant="danger">
                                        { LocalizeText('navigator.roomsettings.passwordismandatory') }
                                    </Text> }
                                <input type="password" className="form-control form-control-sm col-4" value={ confirmPassword } onChange={ event => setConfirmPassword(event.target.value) } onBlur={ saveRoomPassword } placeholder={ LocalizeText('navigator.roomsettings.passwordconfirm') } />
                                { isTryingPassword && ((password.length > 0) && (password !== confirmPassword)) &&
                                    <Text bold small variant="danger">
                                        { LocalizeText('navigator.roomsettings.invalidconfirm') }
                                    </Text> }
                            </Column> }
                    </Flex>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('navigator.roomsettings.pets') }</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ roomData.allowPets } onChange={ event => handleChange('allow_pets', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowpets') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ roomData.allowPetsEat } onChange={ event => handleChange('allow_pets_eat', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</Text>
                    </Flex>
                </Column>
            </Column>
        </>
    );
};
