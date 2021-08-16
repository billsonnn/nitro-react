import { NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer, UserSettingsSoundComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { CreateMessageHook, dispatchMainEvent, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView } from '../../layout';
import { NitroCardView } from '../../layout/card/NitroCardView';
import { LocalizeText } from '../../utils';

export const UserSettingsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ userSettings, setUserSettings ] = useState<NitroSettingsEvent>(null);

    const onUserSettingsUIEvent = useCallback((event: UserSettingsUIEvent) =>
    {
        switch(event.type)
        {
            case UserSettingsUIEvent.SHOW_USER_SETTINGS:
                setIsVisible(true);
                return;
            case UserSettingsUIEvent.HIDE_USER_SETTINGS:
                setIsVisible(false);
                return;
            case UserSettingsUIEvent.TOGGLE_USER_SETTINGS:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(UserSettingsUIEvent.SHOW_USER_SETTINGS, onUserSettingsUIEvent);
    useUiEvent(UserSettingsUIEvent.HIDE_USER_SETTINGS, onUserSettingsUIEvent);
    useUiEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS, onUserSettingsUIEvent);

    const onUserSettingsEvent = useCallback((event: UserSettingsEvent) =>
    {
        const parser = event.getParser();
        const settingsEvent = new NitroSettingsEvent();

        settingsEvent.volumeSystem = parser.volumeSystem;
        settingsEvent.volumeFurni = parser.volumeFurni;
        settingsEvent.volumeTrax = parser.volumeTrax;
        settingsEvent.oldChat = parser.oldChat;
        settingsEvent.roomInvites = parser.roomInvites;
        settingsEvent.cameraFollow = parser.cameraFollow;
        settingsEvent.flags = parser.flags;
        settingsEvent.chatType = parser.chatType;

        setUserSettings(settingsEvent);
    }, []);

    CreateMessageHook(UserSettingsEvent, onUserSettingsEvent);

    const processAction = useCallback((type: string, value?: boolean | number | string) =>
    {
        let doUpdate = true;

        const clone = userSettings.clone();

        switch(type)
        {
            case 'close_view':
                setIsVisible(false);
                doUpdate = false;
                return;
            case 'oldchat':
                clone.oldChat = value as boolean;
                SendMessageHook(new UserSettingsOldChatComposer(clone.oldChat));
                break;
            case 'room_invites':
                clone.roomInvites = value as boolean;
                SendMessageHook(new UserSettingsRoomInvitesComposer(clone.roomInvites));
                break;
            case 'camera_follow':
                clone.cameraFollow = value as boolean;
                SendMessageHook(new UserSettingsCameraFollowComposer(clone.cameraFollow));
                break;
            case 'system_volume':
                clone.volumeSystem = value as number;
                clone.volumeSystem = Math.max(0, clone.volumeSystem);
                clone.volumeSystem = Math.min(100, clone.volumeSystem);
                break;
            case 'furni_volume':
                clone.volumeFurni = value as number;
                clone.volumeFurni = Math.max(0, clone.volumeFurni);
                clone.volumeFurni = Math.min(100, clone.volumeFurni);
                break;
            case 'trax_volume':
                clone.volumeTrax = value as number;
                clone.volumeTrax = Math.max(0, clone.volumeTrax);
                clone.volumeTrax = Math.min(100, clone.volumeTrax);
                break;
        }

        if(doUpdate) setUserSettings(clone);
    }, [userSettings]);

    const saveRangeSlider = useCallback((type: string) =>
    {
        switch(type)
        {
            case 'volume':
                SendMessageHook(new UserSettingsSoundComposer(Math.round(userSettings.volumeSystem), Math.round(userSettings.volumeFurni), Math.round(userSettings.volumeTrax)));
                break;
        }
    }, [userSettings]);

    useEffect(() =>
    {
        if(!userSettings) return;

        dispatchMainEvent(userSettings);
    }, [userSettings]);

    if(!isVisible) return null;

    return (
        <NitroCardView uniqueKey="user-settings" className="user-settings-window">
            <NitroCardHeaderView headerText={ LocalizeText('widget.memenu.settings.title') } onCloseClick={event => processAction('close_view')} />
            <NitroCardContentView className="text-black">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={ userSettings.oldChat } onChange={ event => processAction('oldchat', event.target.checked) } />
                    <label className="form-check-label">{ LocalizeText('memenu.settings.chat.prefer.old.chat') }</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={ userSettings.roomInvites } onChange={ event => processAction('room_invites', event.target.checked) } />
                    <label className="form-check-label">{ LocalizeText('memenu.settings.other.ignore.room.invites') }</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={ userSettings.cameraFollow } onChange={ event => processAction('camera_follow', event.target.checked) } />
                    <label className="form-check-label">{ LocalizeText('memenu.settings.other.disable.room.camera.follow') }</label>
                </div>
                <div className="mt-3 mb-2">{ LocalizeText('widget.memenu.settings.volume') }</div>
                <div className="mb-2">
                    <label>{ LocalizeText('widget.memenu.settings.volume.ui') }</label>
                    <div className={ 'd-flex align-items-center justify-content-center' }>
                        <i className={ 'fas' + ((userSettings.volumeSystem === 0) ? ' fa-volume-mute' : '') + ((userSettings.volumeSystem > 0) ? ' fa-volume-down' : '') + ((userSettings.volumeSystem >= 50) ? ' text-muted' : '') } />
                        <input type="range" className="custom-range ms-2 me-2 w-100" min="0" max="100" step="1" id="volumeSystem" value={ userSettings.volumeSystem } onChange={ event => processAction('system_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                        <i className={ 'fas fa-volume-up' + ((userSettings.volumeSystem < 50) ? ' text-muted': '') } />
                    </div>
                </div>
                <div className="mb-2">
                    <label>{ LocalizeText('widget.memenu.settings.volume.furni') }</label>
                    <div className={ 'd-flex align-items-center justify-content-center' }>
                        <i className={ 'fas' + ((userSettings.volumeFurni === 0) ? ' fa-volume-mute' : '') + ((userSettings.volumeFurni > 0) ? ' fa-volume-down' : '') + ((userSettings.volumeFurni >= 50) ? ' text-muted' : '') } />
                        <input type="range" className="custom-range ms-2 me-2 w-100" min="0" max="100" step="1" id="volumeFurni" value={ userSettings.volumeFurni } onChange={ event => processAction('furni_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                        <i className={ 'fas fa-volume-up' + ((userSettings.volumeFurni < 50) ? ' text-muted': '') } />
                    </div>
                </div>
                <div className="mb-2">
                    <label>{ LocalizeText('widget.memenu.settings.volume.trax') }</label>
                    <div className={ 'd-flex align-items-center justify-content-center' }>
                        <i className={ 'fas' + ((userSettings.volumeTrax === 0) ? ' fa-volume-mute' : '') + ((userSettings.volumeTrax > 0) ? ' fa-volume-down' : '') + ((userSettings.volumeTrax >= 50) ? ' text-muted' : '') } />
                        <input type="range" className="custom-range ms-2 me-2 w-100" min="0" max="100" step="1" id="volumeTrax" value={ userSettings.volumeTrax } onChange={ event => processAction('trax_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                        <i className={ 'fas fa-volume-up' + ((userSettings.volumeTrax < 50) ? ' text-muted': '') } />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
