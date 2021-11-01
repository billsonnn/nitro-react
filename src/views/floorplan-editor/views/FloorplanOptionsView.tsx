import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { NitroCardGridItemView, NitroCardGridView } from '../../../layout';
import { FloorAction } from '../common/Constants';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { floorplanSettings = null, setFloorplanSettings = null } = useFloorplanEditorContext();
    const [ floorAction, setFloorAction ] = useState(FloorAction.SET);
    
    const selectAction = useCallback((action: number) =>
    {
        setFloorAction(action);
        FloorplanEditor.instance.actionSettings.currentAction = action;
    }, []);

    const changeDoorDirection = useCallback(() =>
    {
        const settings = Object.assign({}, floorplanSettings);
        if(settings.entryPointDir < 7)
        {
            ++settings.entryPointDir;
        }
        else
        {
            settings.entryPointDir = 0;
        }

        setFloorplanSettings(settings);
    }, [floorplanSettings, setFloorplanSettings]);

    const onWallHeightChange = useCallback((value: number) =>
    {
        if(value > 16) value = 16;
        if(value < 0) value = 0;

        const settings = Object.assign({}, floorplanSettings);

        settings.wallHeight = value;

        setFloorplanSettings(settings);
    }, [floorplanSettings, setFloorplanSettings]);

    return (
        <>
        <div className="row justify-content-between mb-1">
            <div className="col-6">
                <label>{LocalizeText('floor.plan.editor.draw.mode')}</label>
                <NitroCardGridView className="tile-options">
                    <NitroCardGridItemView itemActive={floorAction === FloorAction.SET} onClick={() => selectAction(FloorAction.SET)} className="tile-option set-tile" />
                    <NitroCardGridItemView itemActive={floorAction === FloorAction.UNSET} onClick={() => selectAction(FloorAction.UNSET)} className="tile-option unset-tile" />
                    <NitroCardGridItemView itemActive={floorAction === FloorAction.UP} onClick={() => selectAction(FloorAction.UP)} className="tile-option increase-height" />
                    <NitroCardGridItemView itemActive={floorAction === FloorAction.DOWN} onClick={() => selectAction(FloorAction.DOWN)} className="tile-option decrease-height" />
                    <NitroCardGridItemView itemActive={floorAction === FloorAction.DOOR} onClick={() => selectAction(FloorAction.DOOR)} className="tile-option set-door" />
                </NitroCardGridView>
            </div>
            <div className="col-6">
                <div className="d-flex w-100 gap-4">
                    <label>{LocalizeText('floor.plan.editor.enter.direction')}</label>
                    <label>{LocalizeText('floor.editor.wall.height')}</label>
                </div>
                <div className="d-flex w-100 gap-4 visualization-options">
                    <NitroCardGridItemView className={`option door-direction-${floorplanSettings.entryPointDir}`} onClick={changeDoorDirection}/>
                    <NitroCardGridItemView className="option"><input type="number" max={16} min={0} step={1} value={floorplanSettings.wallHeight} onChange={event => onWallHeightChange(event.target.valueAsNumber)} id="wallHeight"/></NitroCardGridItemView>
                </div>
            </div>
        </div>
        <div className="row justify-content-between mb-1">

        </div>
        </>
    );
}
