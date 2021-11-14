import { HighScoreDataType, ObjectDataFactory, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { useRoomEngineEvent } from '../../../../../hooks';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { useRoomContext } from '../../../context/RoomContext';
import { ContextMenuHeaderView } from '../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListView } from '../../context-menu/views/list/ContextMenuListView';
import { ObjectLocationView } from '../../object-location/ObjectLocationView';

const SCORE_TYPES = ['perteam', 'mostwins', 'classic'];
const CLEAR_TYPES = ['alltime', 'daily', 'weekly', 'monthly'];

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const [objectId, setObjectId] = useState(-1);
    const [stuffData, setStuffData] = useState<HighScoreDataType>(null);
    const { roomSession = null } = useRoomContext();

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setStuffData(null);
    }, []);

    const onRoomEngineTriggerWidgetEvent = useCallback((event: RoomEngineTriggerWidgetEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY: {
                const object = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, event.category);

                if(!object) return;

                setObjectId(object.id);

                const formatKey = object.model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
                const stuffData = (ObjectDataFactory.getData(formatKey) as HighScoreDataType);

                stuffData.initializeFromRoomObjectModel(object.model);

                setStuffData(stuffData);
                return;
            }
            case RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY:
                if((event.roomId !== roomSession.roomId) || (event.objectId !== objectId)) return;

                close();
                return;
        }
    }, [roomSession, objectId, close]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);

    if((objectId === -1) || !stuffData) return null;

    return (
        <ObjectLocationView objectId={objectId} category={RoomObjectCategory.FLOOR} >
            <div className="nitro-widget-high-score nitro-context-menu">
                <ContextMenuHeaderView>
                    {LocalizeText('high.score.display.caption', ['scoretype', 'cleartype'], [LocalizeText(`high.score.display.scoretype.${SCORE_TYPES[stuffData.scoreType]}`), LocalizeText(`high.score.display.cleartype.${CLEAR_TYPES[stuffData.clearType]}`)])}
                </ContextMenuHeaderView>
                <ContextMenuListView>
                    <NitroLayoutGrid>
                        <NitroLayoutGridColumn size={6}>
                            <NitroLayoutBase className="text-center fw-bold">
                                {LocalizeText('high.score.display.users.header')}
                            </NitroLayoutBase>
                        </NitroLayoutGridColumn>
                        <NitroLayoutGridColumn size={6}>
                            <NitroLayoutBase className="text-center fw-bold">
                                {LocalizeText('high.score.display.score.header')}
                            </NitroLayoutBase>
                        </NitroLayoutGridColumn>
                    </NitroLayoutGrid>
                    <hr className="m-0 my-1" />
                    <NitroLayoutGrid overflow="hidden">
                        <NitroLayoutGridColumn size={6}>
                            {stuffData.entries.map((entry, index) =>
                            {
                                return (
                                    <NitroLayoutBase key={index} className="text-center">
                                        {entry.users.join(', ')}
                                    </NitroLayoutBase>
                                );
                            })
                            }
                        </NitroLayoutGridColumn>
                        <NitroLayoutGridColumn size={6}>
                            {stuffData.entries.map((entry, index) =>
                            {
                                return (
                                    <NitroLayoutBase key={index} className="text-center">
                                        {entry.score}
                                    </NitroLayoutBase>
                                );
                            })
                            }
                        </NitroLayoutGridColumn>
                    </NitroLayoutGrid>
                </ContextMenuListView>
            </div>
        </ObjectLocationView>

    );
}
