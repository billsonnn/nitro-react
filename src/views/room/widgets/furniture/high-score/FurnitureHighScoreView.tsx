import { HighScoreDataType, ObjectDataFactory, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { useRoomEngineEvent } from '../../../../../hooks';
import { useRoomContext } from '../../../context/RoomContext';
import { ContextMenuView } from '../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListView } from '../../context-menu/views/list/ContextMenuListView';

const SCORE_TYPES = ['perteam', 'mostwins', 'classic'];
const CLEAR_TYPES = ['alltime', 'daily', 'weekly', 'monthly'];

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ stuffData, setStuffData ] = useState<HighScoreDataType>(null);
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
    }, [ roomSession, objectId, close ]);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);
    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);

    if((objectId === -1) || !stuffData) return null;

    return (
        <ContextMenuView objectId={ objectId } category={ RoomObjectCategory.FLOOR } close={ close } fades={ false } className="highscore-widget">
            <ContextMenuHeaderView>
                { LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [LocalizeText(`high.score.display.scoretype.${ SCORE_TYPES[stuffData.scoreType] }`), LocalizeText(`high.score.display.cleartype.${ CLEAR_TYPES[stuffData.clearType] }`) ]) }
            </ContextMenuHeaderView>
            <ContextMenuListView>
                <div className="row">
                    <div className="col-6">{ LocalizeText('high.score.display.users.header') }</div>
                    <div className="col-6">{ LocalizeText('high.score.display.score.header') }</div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="container h-100">
                            { stuffData.entries.map((entry, index) =>
                                {
                                    return <div key={ index }>{entry.users.join()}</div>
                                })
                            }
                        </div>
                    </div>
                    <div className="col-6">
                        { stuffData.entries.map((entry, index) =>
                            {
                                return <div key={ index }>{entry.score}</div>
                            })
                        }
                    </div>
                </div>
            </ContextMenuListView>
        </ContextMenuView>
    );
}
