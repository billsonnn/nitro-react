import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, setRoomSettingsData = null, onSave = null } = props;

    const handleChange = useCallback((field: string, value: string | number | boolean) =>
    {
        const clone = Object.assign({}, roomSettingsData);
        let save = true;

        switch(field)
        {
            case 'hide_walls':
                clone.hideWalls = Boolean(value);
                break;
            case 'wall_thickness':
                clone.wallThickness = Number(value);
                break;
            case 'floor_thickness':
                clone.floorThickness = Number(value);
                break;
            case 'bubble_mode':
                clone.chatBubbleMode = Number(value);
                break;
            case 'chat_weight':
                clone.chatBubbleWeight = Number(value);
                break;
            case 'bubble_speed':
                clone.chatBubbleSpeed = Number(value);
                break;
            case 'flood_protection':
                clone.chatFloodProtection = Number(value);
                break;
            case 'chat_distance':
                clone.chatDistance = Number(value);
                save = false;
                break;
        }

        setRoomSettingsData(clone);

        if(save) onSave(clone);
    }, [roomSettingsData, setRoomSettingsData, onSave]);

    return (
        <>
            <div className="fw-bold">{LocalizeText('navigator.roomsettings.vip.caption')}</div>
            <div className="mb-3">{LocalizeText('navigator.roomsettings.vip.info')}</div>
            <div className="fw-bold">{LocalizeText('navigator.roomsettings.vip_settings')}</div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={roomSettingsData.hideWalls} onChange={(e) => handleChange('hide_walls', e.target.checked)} />
                <label className="form-check-label">{LocalizeText('navigator.roomsettings.hide_walls')}</label>
            </div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.wallThickness} onChange={event => handleChange('wall_thickness', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.wall_thickness.normal')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.wall_thickness.thick')}</option>
                    <option value="-1">{LocalizeText('navigator.roomsettings.wall_thickness.thin')}</option>
                    <option value="-2">{LocalizeText('navigator.roomsettings.wall_thickness.thinnest')}</option>
                </select>
            </div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.floorThickness} onChange={event => handleChange('floor_thickness', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.floor_thickness.normal')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.floor_thickness.thick')}</option>
                    <option value="-1">{LocalizeText('navigator.roomsettings.floor_thickness.thin')}</option>
                    <option value="-2">{LocalizeText('navigator.roomsettings.floor_thickness.thinnest')}</option>
                </select>
            </div>
            <div className="fw-bold">{LocalizeText('navigator.roomsettings.chat_settings')}</div>
            <div className="mb-2">{LocalizeText('navigator.roomsettings.chat_settings.info')}</div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleMode} onChange={event => handleChange('bubble_mode', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.chat.mode.free.flow')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.chat.mode.line.by.line')}</option>
                </select>
            </div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleWeight} onChange={event => handleChange('chat_weight', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.chat.bubbles.width.normal')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.chat.bubbles.width.thin')}</option>
                    <option value="2">{LocalizeText('navigator.roomsettings.chat.bubbles.width.wide')}</option>
                </select>
            </div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleSpeed} onChange={event => handleChange('bubble_speed', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.chat.speed.fast')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.chat.speed.normal')}</option>
                    <option value="2">{LocalizeText('navigator.roomsettings.chat.speed.slow')}</option>
                </select>
            </div>
            <div className="form-group mb-1">
                <select className="form-select form-select-sm" value={roomSettingsData.chatFloodProtection} onChange={event => handleChange('flood_protection', event.target.value)}>
                    <option value="0">{LocalizeText('navigator.roomsettings.chat.flood.loose')}</option>
                    <option value="1">{LocalizeText('navigator.roomsettings.chat.flood.normal')}</option>
                    <option value="2">{LocalizeText('navigator.roomsettings.chat.flood.strict')}</option>
                </select>
            </div>
            <div className="form-group mb-0">
                <label>{LocalizeText('navigator.roomsettings.chat_settings.hearing.distance')}</label>
                <input type="number" min="0" className="form-control form-control-sm" value={roomSettingsData.chatDistance} onChange={event => handleChange('chat_distance', event.target.valueAsNumber)} onBlur={() => onSave(roomSettingsData)} />
            </div>
        </>
    );
}
