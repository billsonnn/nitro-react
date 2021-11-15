import { FC, useCallback, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlex, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../layout';
import { NitroLayoutBase } from '../../../layout/base';
import { COLORMAP, FloorAction } from '../common/Constants';
import { FloorplanEditor } from '../common/FloorplanEditor';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

const MIN_WALL_HEIGHT: number = 0;
const MAX_WALL_HEIGHT: number = 16;

const MIN_FLOOR_HEIGHT: number = 0;
const MAX_FLOOR_HEIGHT: number = 26;

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { visualizationSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const [ floorAction, setFloorAction ] = useState(FloorAction.SET);
    const [ floorHeight, setFloorHeight ] = useState(0);
    
    const selectAction = useCallback((action: number) =>
    {
        setFloorAction(action);
        FloorplanEditor.instance.actionSettings.currentAction = action;
    }, []);

    const changeDoorDirection = useCallback(() =>
    {
        setVisualizationSettings(prevValue =>
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
    }, [ setVisualizationSettings ]);

    const onFloorHeightChange = useCallback((value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = 0;

        if(value > 26) value = 26;

        setFloorHeight(value);

        FloorplanEditor.instance.actionSettings.currentHeight = value.toString(36);
    }, []);

    const onFloorThicknessChange = useCallback((value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = Object.assign({}, prevValue);
            newValue.thicknessFloor = value;

            return newValue;
        });
    }, [setVisualizationSettings]);

    const onWallThicknessChange = useCallback((value: number) =>
    {
        setVisualizationSettings(prevValue =>
            {
                const newValue = Object.assign({}, prevValue);
                newValue.thicknessWall = value;
    
                return newValue;
            });
    }, [setVisualizationSettings]);

    const onWallHeightChange = useCallback((value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = MIN_WALL_HEIGHT;

        if(value > MAX_WALL_HEIGHT) value = MAX_WALL_HEIGHT;

        setVisualizationSettings(prevValue =>
            {
                const newValue = Object.assign({}, prevValue);

                newValue.wallHeight = value;

                return newValue;
            });
    }, [ setVisualizationSettings ]);

    function increaseWallHeight(): void
    {
        let height = (visualizationSettings.wallHeight + 1);

        if(height > MAX_WALL_HEIGHT) height = MAX_WALL_HEIGHT;

        onWallHeightChange(height);
    }

    function decreaseWallHeight(): void
    {
        let height = (visualizationSettings.wallHeight - 1);

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
            <NitroLayoutGridColumn className="align-items-center overflow-hidden" size={ 4 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.plan.editor.enter.direction') }</NitroLayoutBase>
                    <i className={ `icon icon-door-direction-${ visualizationSettings.entryPointDir } cursor-pointer` } onClick={ changeDoorDirection } />
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn className="align-items-center" size={ 3 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.editor.wall.height') }</NitroLayoutBase>
                    <NitroLayoutFlex className="align-items-center">
                        <i className="fas fa-caret-left cursor-pointer me-1 text-black" onClick={ decreaseWallHeight } />
                        <input type="number" className="form-control form-control-sm quantity-input" value={ visualizationSettings.wallHeight } onChange={ event => onWallHeightChange(event.target.valueAsNumber)} />
                        <i className="fas fa-caret-right cursor-pointer ms-1 text-black" onClick={ increaseWallHeight } />
                    </NitroLayoutFlex>
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                    <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.plan.editor.tile.height') }: { floorHeight }</NitroLayoutBase>
                    <ReactSlider
                                    className="nitro-slider"
                                    min={ MIN_FLOOR_HEIGHT }
                                    max={ MAX_FLOOR_HEIGHT }
                                    step={ 1 }
                                    value={ floorHeight }
                                    onChange={ event => onFloorHeightChange(event) }
                                    renderThumb={ ({ style, ...rest }, state) => <div style={ { backgroundColor: `#${COLORMAP[state.valueNow.toString(33)]}`, ...style } } { ...rest }>{ state.valueNow }</div> } />
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={5}>
                <NitroLayoutFlexColumn gap={ 2 } overflow="hidden">
                <NitroLayoutBase className="flex-shrink-0 fw-bold text-black text-truncate">{ LocalizeText('floor.plan.editor.room.options') }</NitroLayoutBase>
                <NitroLayoutFlex className="align-items-center">
                    <select className="form-control form-control-sm" value={visualizationSettings.thicknessWall} onChange={event => onWallThicknessChange(parseInt(event.target.value))}>
                        <option value={0}>{ LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }</option>
                        <option value={1}>{ LocalizeText('navigator.roomsettings.wall_thickness.thin') }</option>
                        <option value={2}>{ LocalizeText('navigator.roomsettings.wall_thickness.normal') }</option>
                        <option value={3}>{ LocalizeText('navigator.roomsettings.wall_thickness.thick') }</option>
                    </select>
                    <select className="form-control form-control-sm" value={visualizationSettings.thicknessFloor} onChange={event => onFloorThicknessChange(parseInt(event.target.value))}>
                        <option value={0}>{ LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }</option>
                        <option value={1}>{ LocalizeText('navigator.roomsettings.floor_thickness.thin') }</option>
                        <option value={2}>{ LocalizeText('navigator.roomsettings.floor_thickness.normal') }</option>
                        <option value={3}>{ LocalizeText('navigator.roomsettings.floor_thickness.thick') }</option>
                    </select>
                </NitroLayoutFlex>
                </NitroLayoutFlexColumn>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
