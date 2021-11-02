import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlex, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../layout';
import { NitroLayoutBase } from '../../../layout/base';
import { FloorAction } from '../common/Constants';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

const MIN_WALL_HEIGHT: number = 0;
const MAX_WALL_HEIGHT: number = 16;

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
        setFloorplanSettings(prevValue =>
            {
                const newValue = Object.assign({}, prevValue);

                if(newValue.entryPointDir < 7)
                {
                    ++newValue.entryPointDir;
                }
                else
                {
                    newValue.entryPointDir = 0;
                }

                return newValue;
            });
    }, [ setFloorplanSettings ]);

    const onWallHeightChange = useCallback((value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = MIN_WALL_HEIGHT;

        if(value > MAX_WALL_HEIGHT) value = MAX_WALL_HEIGHT;

        setFloorplanSettings(prevValue =>
            {
                const newValue = Object.assign({}, prevValue);

                newValue.wallHeight = value;

                return newValue;
            });
    }, [ setFloorplanSettings ]);

    function increaseWallHeight(): void
    {
        let height = (floorplanSettings.wallHeight + 1);

        if(height > MAX_WALL_HEIGHT) height = MAX_WALL_HEIGHT;

        onWallHeightChange(height);
    }

    function decreaseWallHeight(): void
    {
        let height = (floorplanSettings.wallHeight - 1);

        if(height <= 0) height = MIN_WALL_HEIGHT;

        onWallHeightChange(height);
    }

    return (
        <NitroLayoutGrid className="h-auto">
            <NitroLayoutGridColumn size={ 5 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.plan.editor.draw.mode') }</NitroLayoutBase>
                    <NitroCardGridView>
                        <NitroCardGridItemView itemActive={ (floorAction === FloorAction.SET) } onClick={ event => selectAction(FloorAction.SET) }>
                            <i className="icon icon-set-tile" />
                        </NitroCardGridItemView>
                        <NitroCardGridItemView itemActive={ (floorAction === FloorAction.UNSET) } onClick={ event => selectAction(FloorAction.UNSET) }>
                            <i className="icon icon-unset-tile" />
                        </NitroCardGridItemView>
                        <NitroCardGridItemView itemActive={ (floorAction === FloorAction.UP) } onClick={ event => selectAction(FloorAction.UP) }>
                            <i className="icon icon-increase-height" />
                        </NitroCardGridItemView>
                        <NitroCardGridItemView itemActive={ (floorAction === FloorAction.DOWN) } onClick={ event => selectAction(FloorAction.DOWN) }>
                            <i className="icon icon-decrease-height" />
                        </NitroCardGridItemView>
                        <NitroCardGridItemView itemActive={ (floorAction === FloorAction.DOOR) } onClick={ event => selectAction(FloorAction.DOOR) }>
                            <i className="icon icon-set-door" />
                        </NitroCardGridItemView>
                    </NitroCardGridView>
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn className="align-items-center" size={ 3 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.plan.editor.enter.direction') }</NitroLayoutBase>
                    <i className={ `icon icon-door-direction-${ floorplanSettings.entryPointDir } cursor-pointer` } onClick={ changeDoorDirection } />
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn className="align-items-center" size={ 3 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.editor.wall.height') }</NitroLayoutBase>
                    <NitroLayoutFlex className="align-items-center">
                        <i className="fas fa-caret-left cursor-pointer me-1 text-black" onClick={ decreaseWallHeight } />
                        <input type="number" className="form-control form-control-sm quantity-input" value={ floorplanSettings.wallHeight } onChange={ event => onWallHeightChange(event.target.valueAsNumber)} />
                        <i className="fas fa-caret-right cursor-pointer ms-1 text-black" onClick={ increaseWallHeight } />
                    </NitroLayoutFlex>
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    //     <NitroLayoutButton variant="primary" size="sm" onClick={ changeDoorDirection }>
    //     <i className={ `icon icon-door-direction-${ floorplanSettings.entryPointDir }` } />
    // </NitroLayoutButton>
        // <>
        // <div className="row justify-content-between mb-1">
        //     <div className="col-6">
        //         <label>{LocalizeText('floor.plan.editor.draw.mode')}</label>
        //         <NitroCardGridView className="tile-options">
        //             <NitroCardGridItemView itemActive={floorAction === FloorAction.SET} onClick={() => selectAction(FloorAction.SET)} className="tile-option set-tile" />
        //             <NitroCardGridItemView itemActive={floorAction === FloorAction.UNSET} onClick={() => selectAction(FloorAction.UNSET)} className="tile-option unset-tile" />
        //             <NitroCardGridItemView itemActive={floorAction === FloorAction.UP} onClick={() => selectAction(FloorAction.UP)} className="tile-option increase-height" />
        //             <NitroCardGridItemView itemActive={floorAction === FloorAction.DOWN} onClick={() => selectAction(FloorAction.DOWN)} className="tile-option decrease-height" />
        //             <NitroCardGridItemView itemActive={floorAction === FloorAction.DOOR} onClick={() => selectAction(FloorAction.DOOR)} className="tile-option set-door" />
        //         </NitroCardGridView>
        //     </div>
        //     <div className="col-6">
        //         <div className="d-flex w-100 gap-4">
        //             <label>{LocalizeText('floor.plan.editor.enter.direction')}</label>
        //             <label>{LocalizeText('floor.editor.wall.height')}</label>
        //         </div>
        //         <div className="d-flex w-100 gap-4 visualization-options">
        //             <NitroCardGridItemView className={`option door-direction-${floorplanSettings.entryPointDir}`} onClick={changeDoorDirection}/>
        //             <NitroCardGridItemView className="option"><input type="number" max={16} min={0} step={1} value={floorplanSettings.wallHeight} onChange={event => onWallHeightChange(event.target.valueAsNumber)} id="wallHeight"/></NitroCardGridItemView>
        //         </div>
        //     </div>
        // </div>
        // <div className="row justify-content-between mb-1">

        // </div>
        // </>
    );
}
