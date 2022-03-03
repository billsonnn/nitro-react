import { NitroEvent, RoomControllerLevel, RoomEngineDimmerStateEvent, RoomEngineTriggerWidgetEvent, RoomSessionDimmerPresetsEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../..';
import { GetSessionDataManager } from '../../..';
import { RoomWidgetUpdateDimmerEvent, RoomWidgetUpdateDimmerStateEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetDimmerChangeStateMessage, RoomWidgetDimmerPreviewMessage, RoomWidgetDimmerSavePresetMessage, RoomWidgetFurniToWidgetMessage, RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FurnitureDimmerWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS: {
                const presetsEvent = (event as RoomSessionDimmerPresetsEvent);
                const updateEvent = new RoomWidgetUpdateDimmerEvent(RoomWidgetUpdateDimmerEvent.PRESETS);

                updateEvent.selectedPresetId = presetsEvent.selectedPresetId;

                let i = 0;

                while(i < presetsEvent.presetCount)
                {
                    const preset = presetsEvent.getPreset(i);

                    if(preset) updateEvent.setPresetValues(preset.id, preset.type, preset.color, preset.brightness);

                    i++;
                }

                this.container.eventDispatcher.dispatchEvent(updateEvent);
                return;
            }
            case RoomEngineDimmerStateEvent.ROOM_COLOR: {
                const stateEvent = (event as RoomEngineDimmerStateEvent);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDimmerStateEvent(stateEvent.state, stateEvent.presetId, stateEvent.effectId, stateEvent.color, stateEvent.brightness));
                return;
            }
            case RoomEngineTriggerWidgetEvent.REMOVE_DIMMER: {
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDimmerEvent(RoomWidgetUpdateDimmerEvent.HIDE));
                return;
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER: {
                if(this.canOpenWidget()) this.container.roomSession.requestMoodlightSettings();

                break;
            }
            case RoomWidgetDimmerSavePresetMessage.SAVE_PRESET: {
                if(this.canOpenWidget())
                {
                    const savePresetMessage = (message as RoomWidgetDimmerSavePresetMessage);

                    this.container.roomSession.updateMoodlightData(savePresetMessage.presetNumber, savePresetMessage.effectTypeId, savePresetMessage.color, savePresetMessage.brightness, savePresetMessage.apply);
                }

                break;
            }
            case RoomWidgetDimmerChangeStateMessage.CHANGE_STATE: {
                if(this.canOpenWidget()) this.container.roomSession.toggleMoodlightState();

                break;
            }
            case RoomWidgetDimmerPreviewMessage.PREVIEW_DIMMER_PRESET: {
                const roomId = this.container.roomSession.roomId;
                const previewMessage = (message as RoomWidgetDimmerPreviewMessage);

                GetRoomEngine().updateObjectRoomColor(roomId, previewMessage.color, previewMessage.brightness, previewMessage.bgOnly);
                
                break;
            }
        }

        return null;
    }

    private canOpenWidget(): boolean
    {
        return (this.container.roomSession.isRoomOwner || (this.container.roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator);
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_DIMMER;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS,
            RoomEngineDimmerStateEvent.ROOM_COLOR,
            RoomEngineTriggerWidgetEvent.REMOVE_DIMMER
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_DIMMER,
            RoomWidgetDimmerSavePresetMessage.SAVE_PRESET,
            RoomWidgetDimmerChangeStateMessage.CHANGE_STATE,
            RoomWidgetDimmerPreviewMessage.PREVIEW_DIMMER_PRESET
        ];
    }
}
