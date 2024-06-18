import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText } from '../../../../api';
import { Text } from '../../../../common';

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
    };

    useEffect(() =>
    {
        setPassword('');
        setConfirmPassword('');
        setIsTryingPassword(false);
    }, [ roomData ]);

    return (
        <>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('navigator.roomsettings.roomaccess.caption') }</Text>
                <Text>{ LocalizeText('navigator.roomsettings.roomaccess.info') }</Text>
            </div>
            <div className="overflow-auto">
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('navigator.roomsettings.doormode') }</Text>
                    <div className="flex items-center gap-1">
                        <input checked={ (roomData.lockState === RoomDataParser.OPEN_STATE) && !isTryingPassword } className="form-check-input" name="lockState" type="radio" onChange={ event => handleChange('lock_state', RoomDataParser.OPEN_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.open') }</Text>
                    </div>
                    <div className="flex items-center gap-1">
                        <input checked={ (roomData.lockState === RoomDataParser.DOORBELL_STATE) && !isTryingPassword } className="form-check-input" name="lockState" type="radio" onChange={ event => handleChange('lock_state', RoomDataParser.DOORBELL_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</Text>
                    </div>
                    <div className="flex items-center gap-1">
                        <input checked={ (roomData.lockState === RoomDataParser.INVISIBLE_STATE) && !isTryingPassword } className="form-check-input" name="lockState" type="radio" onChange={ event => handleChange('lock_state', RoomDataParser.INVISIBLE_STATE) } />
                        <Text>{ LocalizeText('navigator.roomsettings.doormode.invisible') }</Text>
                    </div>
                    <div className="flex w-full gap-1">
                        <input checked={ (roomData.lockState === RoomDataParser.PASSWORD_STATE) || isTryingPassword } className="form-check-input" name="lockState" type="radio" onChange={ event => setIsTryingPassword(event.target.checked) } />
                        { !isTryingPassword && (roomData.lockState !== RoomDataParser.PASSWORD_STATE) &&
                            <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text> }
                        { (isTryingPassword || (roomData.lockState === RoomDataParser.PASSWORD_STATE)) &&
                            <div className="flex flex-col gap-1">
                                <Text>{ LocalizeText('navigator.roomsettings.doormode.password') }</Text>
                                <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm col-span-4" placeholder={ LocalizeText('navigator.roomsettings.password') } type="password" value={ password } onChange={ event => setPassword(event.target.value) } onFocus={ event => setIsTryingPassword(true) } />
                                { isTryingPassword && (password.length <= 0) &&
                                    <Text bold small variant="danger">
                                        { LocalizeText('navigator.roomsettings.passwordismandatory') }
                                    </Text> }
                                <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm col-span-4" placeholder={ LocalizeText('navigator.roomsettings.passwordconfirm') } type="password" value={ confirmPassword } onBlur={ saveRoomPassword } onChange={ event => setConfirmPassword(event.target.value) } />
                                { isTryingPassword && ((password.length > 0) && (password !== confirmPassword)) &&
                                    <Text bold small variant="danger">
                                        { LocalizeText('navigator.roomsettings.invalidconfirm') }
                                    </Text> }
                            </div> }
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Text bold>{ LocalizeText('navigator.roomsettings.pets') }</Text>
                    <div className="flex items-center gap-1">
                        <input checked={ roomData.allowPets } className="form-check-input" type="checkbox" onChange={ event => handleChange('allow_pets', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowpets') }</Text>
                    </div>
                    <div className="flex items-center gap-1">
                        <input checked={ roomData.allowPetsEat } className="form-check-input" type="checkbox" onChange={ event => handleChange('allow_pets_eat', event.target.checked) } />
                        <Text>{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</Text>
                    </div>
                </div>
            </div>
        </>
    );
};
