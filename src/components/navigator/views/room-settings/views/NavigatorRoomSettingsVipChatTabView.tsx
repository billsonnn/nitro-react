import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { NavigatorRoomSettingsTabViewProps } from './NavigatorRoomSettingsTabViewProps.types';

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomSettingsData = null, handleChange = null } = props;

    return (
        <>
            <Column gap={ 1 }>
                <Text bold>{LocalizeText('navigator.roomsettings.vip.caption')}</Text>
                <Text>{LocalizeText('navigator.roomsettings.vip.info')}</Text>
            </Column>
            <Grid overflow="auto">
                <Column size={ 6 } gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.chat_settings')}</Text>
                    <Text>{LocalizeText('navigator.roomsettings.chat_settings.info')}</Text>
                    <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleMode} onChange={event => handleChange('bubble_mode', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.chat.mode.free.flow')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.chat.mode.line.by.line')}</option>
                    </select>
                    <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleWeight} onChange={event => handleChange('chat_weight', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.chat.bubbles.width.normal')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.chat.bubbles.width.thin')}</option>
                        <option value="2">{LocalizeText('navigator.roomsettings.chat.bubbles.width.wide')}</option>
                    </select>
                    <select className="form-select form-select-sm" value={roomSettingsData.chatBubbleSpeed} onChange={event => handleChange('bubble_speed', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.chat.speed.fast')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.chat.speed.normal')}</option>
                        <option value="2">{LocalizeText('navigator.roomsettings.chat.speed.slow')}</option>
                    </select>
                    <select className="form-select form-select-sm" value={roomSettingsData.chatFloodProtection} onChange={event => handleChange('flood_protection', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.chat.flood.loose')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.chat.flood.normal')}</option>
                        <option value="2">{LocalizeText('navigator.roomsettings.chat.flood.strict')}</option>
                    </select>
                    <Text>{ LocalizeText('navigator.roomsettings.chat_settings.hearing.distance') }</Text>
                    <input type="number" min="0" className="form-control form-control-sm" value={roomSettingsData.chatDistance} onChange={event => handleChange('chat_distance', event.target.valueAsNumber)} onBlur={ event => handleChange('save', null) } />
                </Column>
                <Column size={ 6 } gap={ 1 }>
                    <Text bold>{LocalizeText('navigator.roomsettings.vip_settings')}</Text>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={roomSettingsData.hideWalls} onChange={(e) => handleChange('hide_walls', e.target.checked)} />
                        <Text>{LocalizeText('navigator.roomsettings.hide_walls')}</Text>
                    </Flex>
                    <select className="form-select form-select-sm" value={roomSettingsData.wallThickness} onChange={event => handleChange('wall_thickness', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.wall_thickness.normal')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.wall_thickness.thick')}</option>
                        <option value="-1">{LocalizeText('navigator.roomsettings.wall_thickness.thin')}</option>
                        <option value="-2">{LocalizeText('navigator.roomsettings.wall_thickness.thinnest')}</option>
                    </select>
                    <select className="form-select form-select-sm" value={roomSettingsData.floorThickness} onChange={event => handleChange('floor_thickness', event.target.value)}>
                        <option value="0">{LocalizeText('navigator.roomsettings.floor_thickness.normal')}</option>
                        <option value="1">{LocalizeText('navigator.roomsettings.floor_thickness.thick')}</option>
                        <option value="-1">{LocalizeText('navigator.roomsettings.floor_thickness.thin')}</option>
                        <option value="-2">{LocalizeText('navigator.roomsettings.floor_thickness.thinnest')}</option>
                    </select>
                </Column>
            </Grid>
        </>
    );
}
