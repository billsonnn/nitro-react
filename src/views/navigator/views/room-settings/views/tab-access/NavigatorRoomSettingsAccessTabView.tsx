import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
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
                roomSettings.lockState =  Number(value);

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
        return (roomSettingsData.password && roomSettingsData.password.length > 0 && roomSettingsData.password === roomSettingsData.confirmPassword);
    }, [ roomSettingsData ]);

    const trySave = useCallback(() =>
    {
        if(isPasswordValid()) onSave(roomSettingsData);
    }, [isPasswordValid, onSave, roomSettingsData]);

    return (
        <>
            <div className="fw-bold">{LocalizeText('navigator.roomsettings.roomaccess.caption')}</div>
            <div className="mb-3">{ LocalizeText('navigator.roomsettings.roomaccess.info') }</div>
            <div className="fw-bold">{ LocalizeText('navigator.roomsettings.doormode') }</div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 0 } onChange={ (e) => handleChange('lock_state', 0) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.doormode.open') }</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 1 } onChange={ (e) => handleChange('lock_state', 1) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.doormode.doorbell') }</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 2 } onChange={ (e) => handleChange('lock_state', 2) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.doormode.invisible') }</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="lockState" checked={ roomSettingsData.lockState === 3 } onChange={ (e) => handleChange('lock_state', 3) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.doormode.password') }</label>
            </div>
            { roomSettingsData.lockState === 3 && <>
                <div className="form-group mt-2">
                    <label>{ LocalizeText('navigator.roomsettings.password') }</label>
                    <input type="password" className="form-control form-control-sm" value={ roomSettingsData.password ?? '' } onChange={ (e) => handleChange('password', e.target.value) } onBlur={ trySave } placeholder="*****" />
                </div>
                <div className="form-group">
                    <label>{ LocalizeText('navigator.roomsettings.passwordconfirm') }</label>
                    <input type="password" className="form-control form-control-sm" value={ roomSettingsData.confirmPassword ?? '' } onChange={ (e) => handleChange('confirm_password', e.target.value) } onBlur={ trySave } placeholder="*****" />
                    { !isPasswordValid() && <small className="text-danger fw-bold">
                        { LocalizeText('navigator.roomsettings.invalidconfirm') }
                    </small> }
                </div>
            </> }
            <div className="fw-bold mt-2">{ LocalizeText('navigator.roomsettings.pets') }</div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPets } onChange={ (e) => handleChange('allow_pets', e.target.checked) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.allowpets') }</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={ roomSettingsData.allowPetsEat } onChange={ (e) => handleChange('allow_pets_eat', e.target.checked) } />
                <label className="form-check-label">{ LocalizeText('navigator.roomsettings.allowfoodconsume') }</label>
            </div>
        </>
    );
};
