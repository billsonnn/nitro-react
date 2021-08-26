import { RoomUnbanUserComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsModTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;
    const [selectedUserId, setSelectedUserId] = useState<number>(-1);

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const clone = Object.assign({}, roomSettingsData);
        let save = true;

        switch(field)
        {
            case 'moderation_mute':
                clone.muteState = Number(value);
                break;
            case 'moderation_kick':
                clone.kickState = Number(value);
                break;
            case 'moderation_ban':
                clone.banState = Number(value);
                break;
        }

        setRoomSettingsData(clone);

        if(save) onSave(clone);
    }, [roomSettingsData, setRoomSettingsData, onSave]);

    const unBanUser = useCallback((userId: number) =>
    {
        const clone = Object.assign({}, roomSettingsData);

        clone.bannedUsers.delete(userId);
        setRoomSettingsData(clone);

        SendMessageHook(new RoomUnbanUserComposer(userId, roomSettingsData.roomId));
        setSelectedUserId(-1);
    }, [roomSettingsData, setRoomSettingsData]);

    return (
        <>
            <div className="mb-3">{LocalizeText('navigator.roomsettings.moderation.header')}</div>
            <div className="form-group mb-1" >
                <div className="fw-bold">{LocalizeText('navigator.roomsettings.moderation.mute.header')}</div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_mute" checked={roomSettingsData.muteState === 0} onChange={(e) => handleChange('moderation_mute', 0)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.none')}</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_mute" checked={roomSettingsData.muteState === 1} onChange={(e) => handleChange('moderation_mute', 1)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.rights')}</label>
                </div>
            </div>
            <div className="form-group mb-1" >
                <div className="fw-bold">{LocalizeText('navigator.roomsettings.moderation.kick.header')}</div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_kick" checked={roomSettingsData.kickState === 0} onChange={(e) => handleChange('moderation_kick', 0)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.all')}</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_kick" checked={roomSettingsData.kickState === 1} onChange={(e) => handleChange('moderation_kick', 1)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.rights')}</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_kick" checked={roomSettingsData.kickState === 2} onChange={(e) => handleChange('moderation_kick', 2)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.none')}</label>
                </div>
            </div>
            <div className="form-group mb-1" >
                <div className="fw-bold">{LocalizeText('navigator.roomsettings.moderation.ban.header')}</div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_ban" checked={roomSettingsData.banState === 0} onChange={(e) => handleChange('moderation_ban', 0)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.none')}</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="moderation_ban" checked={roomSettingsData.banState === 1} onChange={(e) => handleChange('moderation_ban', 1)} />
                    <label className="form-check-label">{LocalizeText('navigator.roomsettings.moderation.rights')}</label>
                </div>
            </div>
            <div className="fw-bold mt-3 mb-1">{LocalizeText('navigator.roomsettings.moderation.banned.users')} ({roomSettingsData.bannedUsers.size})</div>
            <div className="row">
                <div className="col-6">
                    <div className="list-container">
                        {
                            Array.from(roomSettingsData.bannedUsers.entries()).map(([id, name], index) =>
                            {
                                return <div key={index} className={'list-item' + ((id === selectedUserId) ? ' selected' : '')} onClick={e => setSelectedUserId(id)} >
                                    {name}
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="col-6">
                    <button className={'btn btn-primary btn-sm w-100' + ((selectedUserId < 1) ? ' disabled' : '')} onClick={ e => unBanUser(selectedUserId) }>{LocalizeText('navigator.roomsettings.moderation.unban')} {selectedUserId > 0 && roomSettingsData.bannedUsers.get(selectedUserId)}
                    </button>
                </div>
            </div>
        </>
    );
}
