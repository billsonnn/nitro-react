import { RoomControllerLevel, RoomEngineDimmerStateEvent, RoomEngineTriggerWidgetEvent, RoomSessionDimmerPresetsEvent } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetSessionDataManager, RoomWidgetUpdateDimmerEvent, RoomWidgetUpdateDimmerStateEvent } from '../../../../api';
import { UseRoomEngineEvent, UseRoomSessionManagerEvent } from '../../../events';
import { useRoom } from '../../useRoom';

const useFurnitureDimmerWidgetState = () =>
{
    const { roomSession = null, widgetHandler = null } = useRoom();

    const canOpenWidget = () => (roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator);

    const savePreset = (presetNumber: number, effectTypeId: number, color: number, brightness: number, apply: boolean) =>
    {
        if(!canOpenWidget()) return;

        roomSession.updateMoodlightData(presetNumber, effectTypeId, color, brightness, apply);
    }

    const changeState = () =>
    {
        if(!canOpenWidget()) return;

        roomSession.toggleMoodlightState();
    }

    const previewDimmer = (color: number, brightness: number, bgOnly: boolean) =>
    {
        GetRoomEngine().updateObjectRoomColor(roomSession.roomId, color, brightness, bgOnly);
    }

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, event =>
    {
        if(!canOpenWidget()) return;
        
        roomSession.requestMoodlightSettings();
    });

    UseRoomEngineEvent<RoomEngineDimmerStateEvent>(RoomEngineDimmerStateEvent.ROOM_COLOR, event =>
    {
        widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDimmerStateEvent(event.state, event.presetId, event.effectId, event.color, event.brightness));
    });

    UseRoomSessionManagerEvent<RoomSessionDimmerPresetsEvent>(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, event =>
    {
        const updateEvent = new RoomWidgetUpdateDimmerEvent(RoomWidgetUpdateDimmerEvent.PRESETS);

        updateEvent.selectedPresetId = event.selectedPresetId;

        let i = 0;

        while(i < event.presetCount)
        {
            const preset = event.getPreset(i);

            if(preset) updateEvent.setPresetValues(preset.id, preset.type, preset.color, preset.brightness);

            i++;
        }

        widgetHandler.eventDispatcher.dispatchEvent(updateEvent);
    });

    UseRoomEngineEvent<RoomEngineDimmerStateEvent>(RoomEngineDimmerStateEvent.ROOM_COLOR, event =>
    {
        widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDimmerEvent(RoomWidgetUpdateDimmerEvent.HIDE));
    });

    return { savePreset, changeState, previewDimmer };
}

export const useFurnitureDimmerWidget = useFurnitureDimmerWidgetState;
