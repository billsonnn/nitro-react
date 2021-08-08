import { NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer } from '@nitrots/nitro-renderer';
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
        switch (event.type)
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

    const processAction = useCallback((type: string, value: boolean = false) =>
    {
        let doUpdate = true;

        const clone = userSettings.clone();

        switch(type)
        {
            case 'close_view':
                setIsVisible(false);
                return;
            case 'oldchat':
                clone.oldChat = value;
                SendMessageHook(new UserSettingsOldChatComposer(value));
                break;
            case 'room_invites':
                clone.roomInvites = value;
                SendMessageHook(new UserSettingsRoomInvitesComposer(value));
                break;
            case 'camera_follow':
                console.log(value);
                clone.cameraFollow = value;
                SendMessageHook(new UserSettingsCameraFollowComposer(value));
                break;
        }

        if(doUpdate) setUserSettings(clone);
    }, [ userSettings ]);

    useEffect(() =>
    {
        if(!userSettings) return;

        dispatchMainEvent(userSettings);
    }, [ userSettings ]);

    if (!isVisible) return null;

    return (
        <div className="user-settings-window">
            <NitroCardView>
                <NitroCardHeaderView headerText={LocalizeText('widget.memenu.settings.title')} onCloseClick={event => processAction('close_view')} />
                <NitroCardContentView>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={ userSettings.oldChat } onChange={event => processAction('oldchat', event.target.checked)} />
                        <label className="form-check-label">{LocalizeText('memenu.settings.chat.prefer.old.chat')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={ userSettings.roomInvites } onChange={event => processAction('room_invites', event.target.checked)} />
                        <label className="form-check-label">{LocalizeText('memenu.settings.other.ignore.room.invites')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={ userSettings.cameraFollow } onChange={event => processAction('camera_follow', event.target.checked)} />
                        <label className="form-check-label">{LocalizeText('memenu.settings.other.disable.room.camera.follow')}</label>
                    </div>
                    <div className="mt-3 mb-2">{LocalizeText('widget.memenu.settings.volume')}</div>
                    <div className="mb-2">
                        <label>{LocalizeText('widget.memenu.settings.volume.ui')}</label>
                    </div>

                </NitroCardContentView>
            </NitroCardView>
        </div>
    );
}
