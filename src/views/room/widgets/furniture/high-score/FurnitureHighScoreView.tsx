import { HighScoreDataType, ObjectDataFactory, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { useRoomEngineEvent } from '../../../../../hooks';
import { useRoomContext } from '../../../context/RoomContext';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListView } from '../../context-menu/ContextMenuListView';
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
        <ObjectLocationView objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
            <div className="nitro-widget-high-score nitro-context-menu">
                <ContextMenuHeaderView>
                    { LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ SCORE_TYPES[stuffData.scoreType] }`), LocalizeText(`high.score.display.cleartype.${ CLEAR_TYPES[stuffData.clearType] }`)]) }
                </ContextMenuHeaderView>
                <ContextMenuListView overflow="hidden" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center">
                            <Text center bold variant="white" className="col-8">
                                { LocalizeText('high.score.display.users.header') }
                            </Text>
                            <Text center bold variant="white" className="col-4">
                                { LocalizeText('high.score.display.score.header') }
                            </Text>
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column overflow="auto" gap={ 1 }>
                        { stuffData.entries.map((entry, index) =>
                            {
                                return (
                                    <Flex key={ index } alignItems="center">
                                        <Text center variant="white" className="col-8">
                                            { entry.users.join(', ') }
                                        </Text>
                                        <Text center variant="white" className="col-4">
                                            { entry.score }
                                        </Text>
                                    </Flex>
                                );
                            }) }
                    </Column>
                </ContextMenuListView>
            </div>
        </ObjectLocationView>

    );
}
