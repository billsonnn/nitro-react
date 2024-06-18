import { GetSessionDataManager, RoomControllerLevel, RoomEngineDimmerStateEvent, RoomEngineTriggerWidgetEvent, RoomId, RoomSessionDimmerPresetsEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { DimmerFurnitureWidgetPresetItem, FurnitureDimmerUtilities } from '../../../../api';
import { useNitroEvent } from '../../../events';
import { useRoom } from '../../useRoom';

const useFurnitureDimmerWidgetState = () =>
{
    const [ presets, setPresets ] = useState<DimmerFurnitureWidgetPresetItem[]>([]);
    const [ selectedPresetId, setSelectedPresetId ] = useState(0);
    const [ dimmerState, setDimmerState ] = useState(0);
    const [ lastDimmerState, setLastDimmerState ] = useState(0);
    const [ effectId, setEffectId ] = useState(0);
    const [ color, setColor ] = useState(0xFFFFFF);
    const [ brightness, setBrightness ] = useState(0xFF);
    const [ selectedEffectId, setSelectedEffectId ] = useState(0);
    const [ selectedColor, setSelectedColor ] = useState(0);
    const [ selectedBrightness, setSelectedBrightness ] = useState(0);
    const { roomSession = null } = useRoom();

    const canOpenWidget = () => (roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator);

    const selectPresetId = (id: number) =>
    {
        const preset = presets[(id - 1)];

        if(!preset) return;

        setSelectedPresetId(preset.id);
        setSelectedEffectId(preset.type);
        setSelectedColor(preset.color);
        setSelectedBrightness(preset.light);
    };

    const applyChanges = () =>
    {
        if(dimmerState === 0) return;

        const selectedPresetIndex = (selectedPresetId - 1);

        if((selectedPresetId < 1) || (selectedPresetId > presets.length)) return;

        const preset = presets[selectedPresetIndex];

        if(!preset || ((selectedEffectId === preset.type) && (selectedColor === preset.color) && (selectedBrightness === preset.light))) return;

        setPresets(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue[selectedPresetIndex] = new DimmerFurnitureWidgetPresetItem(preset.id, selectedEffectId, selectedColor, selectedBrightness);

            return newValue;
        });

        FurnitureDimmerUtilities.savePreset(preset.id, selectedEffectId, selectedColor, selectedBrightness, true);
    };

    useNitroEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, event =>
    {
        if(!canOpenWidget()) return;

        roomSession.requestMoodlightSettings();
    });

    useNitroEvent<RoomSessionDimmerPresetsEvent>(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, event =>
    {
        const presets: DimmerFurnitureWidgetPresetItem[] = [];

        let i = 0;

        while(i < event.presetCount)
        {
            const preset = event.getPreset(i);

            if(preset) presets.push(new DimmerFurnitureWidgetPresetItem(preset.id, preset.type, preset.color, preset.brightness));

            i++;
        }

        setPresets(presets);
        setSelectedPresetId(event.selectedPresetId);
    });

    useNitroEvent<RoomEngineDimmerStateEvent>(RoomEngineDimmerStateEvent.ROOM_COLOR, event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        setLastDimmerState(dimmerState);
        setDimmerState(event.state);
        setSelectedPresetId(event.presetId);
        setEffectId(event.effectId);
        setSelectedEffectId(event.effectId);
        setColor(event.color);
        setSelectedColor(event.color);
        setBrightness(event.brightness);
        setSelectedBrightness(event.brightness);
    });

    useEffect(() =>
    {
        if((dimmerState === 0) && (lastDimmerState === 0)) return;

        FurnitureDimmerUtilities.previewDimmer(selectedColor, selectedBrightness, (selectedEffectId === 2));
    }, [ dimmerState, lastDimmerState, selectedColor, selectedBrightness, selectedEffectId ]);

    return { presets, selectedPresetId, dimmerState, lastDimmerState, effectId, color, brightness, selectedEffectId, setSelectedEffectId, selectedColor, setSelectedColor, selectedBrightness, setSelectedBrightness, selectPresetId, applyChanges };
};

export const useFurnitureDimmerWidget = useFurnitureDimmerWidgetState;
