import { NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { CreateMessageHook, dispatchMainEvent, SendMessageHook, useUiEvent } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView } from '../../layout';
import { NitroCardView } from '../../layout/card/NitroCardView';
import { LocalizeText } from '../../utils';

export const UserSettingsView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [useOldChat, setUseOldChat] = useState(false);
    const [allowRoomInvites, setAllowRoomInvites] = useState(false);
    const [cameraFollowDisabled, setCameraFollowDisabled] = useState(false);
    const [systemVolume, setSystemVolume] = useState(0);
    const [furniVolume, setFurniVolume] = useState(0);
    const [traxVolume, setTraxVolume] = useState(0);
    const [flags, setFlags] = useState(0);
    const [chatType, setChatType] = useState(0);

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

    const updateUserSettings = useCallback(() =>
    {
        const event = new NitroSettingsEvent(NitroSettingsEvent.SETTINGS_UPDATED);
        event.flags = flags;
        event.oldChat = useOldChat;
        event.roomInvites = allowRoomInvites;
        event.volumeFurni = furniVolume;
        event.volumeSystem = systemVolume;
        event.volumeTrax = traxVolume;
        event.oldChat = useOldChat;
        event.chatType = chatType
        event.cameraFollow = cameraFollowDisabled;
        dispatchMainEvent(event);
    }, [allowRoomInvites, cameraFollowDisabled, chatType, flags, furniVolume, systemVolume, traxVolume, useOldChat]);

    const onUserSettingsEvent = useCallback((event: UserSettingsEvent) =>
    {
        const parser = event.getParser();

        setAllowRoomInvites(parser.roomInvites);
        setCameraFollowDisabled(parser.cameraFollow);
        setFurniVolume(parser.volumeFurni);
        setSystemVolume(parser.volumeSystem);
        setTraxVolume(parser.volumeTrax);
        setUseOldChat(parser.oldChat);
        setChatType(parser.chatType);
        setFlags(parser.flags);

        updateUserSettings();
        console.log(parser);
    }, [updateUserSettings]);

    CreateMessageHook(UserSettingsEvent, onUserSettingsEvent);

    const processAction = useCallback((type: string, value?: string | number | boolean) =>
    {
        switch (type)
        {
            case 'close_view':
                setIsVisible(false);
                return;
            case 'oldchat':
                setUseOldChat(Boolean(value));
                SendMessageHook(new UserSettingsOldChatComposer(useOldChat));
                updateUserSettings();
                return;
            case 'room_invites':
                setAllowRoomInvites(Boolean(value));
                SendMessageHook(new UserSettingsRoomInvitesComposer(allowRoomInvites));
                updateUserSettings();
                return;
            case 'camera_follow':
                setCameraFollowDisabled(value as boolean);
                SendMessageHook(new UserSettingsCameraFollowComposer(cameraFollowDisabled));
                updateUserSettings();
                console.log(value as boolean);
                console.log(cameraFollowDisabled);
                return;
        }
    }, [allowRoomInvites, cameraFollowDisabled, updateUserSettings, useOldChat]);

    if (!isVisible) return null;

    return (
        <div className="user-settings-window">
            <NitroCardView>
                <NitroCardHeaderView headerText={LocalizeText('widget.memenu.settings.title')} onCloseClick={event => processAction('close_view')} />
                <NitroCardContentView>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={useOldChat} onChange={event => processAction('oldchat', event.target.checked)} />
                        <label className="form-check-label">{LocalizeText('memenu.settings.chat.prefer.old.chat')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={allowRoomInvites} onChange={event => processAction('room_invites', event.target.checked)} />
                        <label className="form-check-label">{LocalizeText('memenu.settings.other.ignore.room.invites')}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={cameraFollowDisabled} onChange={event => processAction('camera_follow', event.target.checked)} />
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
