import { ContextMenuEnum, IRoomObject, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectCategory } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, IsOwnerOfFurniture } from '../../../../../api';
import { useRoomEngineEvent } from '../../../../../hooks/events';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../context/RoomContext';
import { ContextMenuView } from '../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/views/list-item/ContextMenuListItemView';

const MONSTERPLANT_SEED_CONFIRMATION: string = 'MONSTERPLANT_SEED_CONFIRMATION';

export const FurnitureContextMenuView: FC<{}> = props =>
{
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ roomObject, setRoomObject ] = useState<IRoomObject>(null);
    const [ contextMenu, setContextMenu ] = useState<string>(null);

    const close = useCallback(() =>
    {
        setRoomObject(null);
        setContextMenu(null);
    }, []);

    const onRoomEngineTriggerWidgetEvent = useCallback((event: RoomEngineTriggerWidgetEvent) =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, event.category);

        if(!roomObject) return;

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU:
                switch(event.contextMenu)
                {
                    case ContextMenuEnum.FRIEND_FURNITURE:
                        return;
                    case ContextMenuEnum.MONSTERPLANT_SEED:
                        if(IsOwnerOfFurniture(roomObject))
                        {
                            setRoomObject(roomObject);
                            setContextMenu(ContextMenuEnum.MONSTERPLANT_SEED);
                        }
                        return;
                    case ContextMenuEnum.MYSTERY_BOX:
                        return;
                    case ContextMenuEnum.RANDOM_TELEPORT:
                        return;
                    case ContextMenuEnum.PURCHASABLE_CLOTHING:
                        return;
                }

                return;
            case RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU:
                close();
                return;
        }
    }, [ roomSession, close ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU, onRoomEngineTriggerWidgetEvent);

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(!roomObject || (event.objectId !== roomObject.id)) return;

        close();
    }, [ roomObject, close ]);

    useRoomEngineEvent(RoomEngineObjectEvent.REMOVED, onRoomEngineObjectEvent);

    const processAction = useCallback((name: string) =>
    {
        if(name)
        {
            switch(name)
            {
                case 'use_monsterplant_seed':
                    setContextMenu(MONSTERPLANT_SEED_CONFIRMATION);
                    break;
            }
        }
    }, [  ]);

    if(!roomObject || !contextMenu) return null;

    return (
        <ContextMenuView objectId={ roomObject.id } category={ RoomObjectCategory.FLOOR } close={ close }>
            { (contextMenu === ContextMenuEnum.MONSTERPLANT_SEED) &&
                <>
                    <ContextMenuHeaderView>
                        { LocalizeText('furni.mnstr_seed.name') }
                    </ContextMenuHeaderView>
                    <ContextMenuListItemView onClick={ event => processAction('use_monsterplant_seed') }>
                        { LocalizeText('widget.monsterplant_seed.button.use') }
                    </ContextMenuListItemView>
                </> }
        </ContextMenuView>
    )
}
