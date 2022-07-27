import { FurnitureMannequinSaveLookComposer, FurnitureMannequinSaveNameComposer, FurnitureMultiStateComposer, HabboClubLevelEnum, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetAvatarRenderManager, GetRoomEngine, MannequinUtilities, SendMessageComposer } from '../../../../api';
import { useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureMannequinWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ figure, setFigure ] = useState(null);
    const [ gender, setGender ] = useState(null);
    const [ clubLevel, setClubLevel ] = useState(HabboClubLevelEnum.NO_CLUB);
    const [ name, setName ] = useState(null);

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setFigure(null);
        setGender(null);
        setName(null);
    }

    const saveFigure = () =>
    {
        if(objectId === -1) return;

        SendMessageComposer(new FurnitureMannequinSaveLookComposer(objectId));

        onClose();
    }

    const wearFigure = () =>
    {
        if(objectId === -1) return;

        SendMessageComposer(new FurnitureMultiStateComposer(objectId));

        onClose();
    }

    const saveName = () =>
    {
        if(objectId === -1) return;

        SendMessageComposer(new FurnitureMannequinSaveNameComposer(objectId, name));
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        const model = roomObject.model;
        const figure = (model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_FIGURE) || null);
        const gender = (model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_GENDER) || null);
        const figureContainer = GetAvatarRenderManager().createFigureContainer(figure);
        const figureClubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender, MannequinUtilities.MANNEQUIN_CLOTHING_PART_TYPES);

        setObjectId(event.objectId);
        setCategory(event.category);
        setFigure(figure);
        setGender(gender);
        setClubLevel(figureClubLevel);
        setName(model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_NAME) || null);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, figure, gender, clubLevel, name, setName, saveFigure, wearFigure, saveName, onClose };
}

export const useFurnitureMannequinWidget = useFurnitureMannequinWidgetState;
