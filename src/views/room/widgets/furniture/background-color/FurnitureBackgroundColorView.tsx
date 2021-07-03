import { NitroEvent, RoomControllerLevel, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, GetSessionDataManager } from '../../../../../api';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../context/RoomContext';
import { RoomWidgetRoomObjectUpdateEvent } from '../../../events';

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const [ furniId, setFurniId ] = useState(-1);
    const [ objectId, setObjectId ] = useState(-1);
    const [ hue, setHue ] = useState(0);
    const [ saturation, setSaturation ] = useState(0);
    const [ light, setLight ] = useState(0);
    const { roomSession = null, eventDispatcher = null } = useRoomContext();

    const canOpenBackgroundToner = useCallback(() =>
    {
        const isRoomOwner = roomSession.isRoomOwner;
        const hasLevel = (roomSession.controllerLevel >= RoomControllerLevel.GUEST);
        const isGodMode = GetSessionDataManager().isGodMode;

        return (isRoomOwner || hasLevel || isGodMode);
    }, [ roomSession ]);

    const onNitroEvent = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR: {
                if(!canOpenBackgroundToner()) return;

                const roomEngineObjectEvent = (event as RoomEngineObjectEvent);
                const roomObject = GetRoomEngine().getRoomObject(roomEngineObjectEvent.roomId, roomEngineObjectEvent.objectId, roomEngineObjectEvent.category);
                const model = roomObject.model;
                
                setFurniId(roomObject.id);
                setObjectId(roomObject.instanceId);
                setHue(parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE)));
                setSaturation(parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION)));
                setLight(parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS)));
                
                return;
            }
            case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                setObjectId(prevValue =>
                    {
                        if(prevValue === widgetEvent.id) return null;

                        return prevValue;
                    });
                return;
            }
        }
    }, [ canOpenBackgroundToner ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, onNitroEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onNitroEvent);

    if(objectId === -1) return null;

    return (
        <NitroCardView simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('widget.backgroundcolor.title') } onCloseClick={ event => setObjectId(-1) } />
            <NitroCardContentView>
                background toner
            </NitroCardContentView>
        </NitroCardView>
    );
}
