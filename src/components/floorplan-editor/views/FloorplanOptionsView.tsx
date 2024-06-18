import { FC, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../api';
import { Column, Flex, Grid, LayoutGridItem, Text } from '../../../common';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';
import { COLORMAP, FloorAction } from '../common/Constants';
import { FloorplanEditor } from '../common/FloorplanEditor';

const MIN_WALL_HEIGHT: number = 0;
const MAX_WALL_HEIGHT: number = 16;

const MIN_FLOOR_HEIGHT: number = 0;
const MAX_FLOOR_HEIGHT: number = 26;

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { visualizationSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext();
    const [ floorAction, setFloorAction ] = useState(FloorAction.SET);
    const [ floorHeight, setFloorHeight ] = useState(0);

    const selectAction = (action: number) =>
    {
        setFloorAction(action);

        FloorplanEditor.instance.actionSettings.currentAction = action;
    };

    const changeDoorDirection = () =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

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
    };

    const onFloorHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = 0;

        if(value > 26) value = 26;

        setFloorHeight(value);

        FloorplanEditor.instance.actionSettings.currentHeight = value.toString(36);
    };

    const onFloorThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessFloor = value;

            return newValue;
        });
    };

    const onWallThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.thicknessWall = value;

            return newValue;
        });
    };

    const onWallHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = MIN_WALL_HEIGHT;

        if(value > MAX_WALL_HEIGHT) value = MAX_WALL_HEIGHT;

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.wallHeight = value;

            return newValue;
        });
    };

    const increaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight + 1);

        if(height > MAX_WALL_HEIGHT) height = MAX_WALL_HEIGHT;

        onWallHeightChange(height);
    };

    const decreaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight - 1);

        if(height <= 0) height = MIN_WALL_HEIGHT;

        onWallHeightChange(height);
    };

    return (
        <div className="flex flex-col">
            <Grid>
                <Column gap={ 1 } size={ 5 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.draw.mode') }</Text>
                    <Flex gap={ 3 }>
                        <div className="flex gap-1">
                            <LayoutGridItem itemActive={ (floorAction === FloorAction.SET) } onClick={ event => selectAction(FloorAction.SET) }>
                                <i className="nitro-icon icon-set-tile" />
                            </LayoutGridItem>
                            <LayoutGridItem itemActive={ (floorAction === FloorAction.UNSET) } onClick={ event => selectAction(FloorAction.UNSET) }>
                                <i className="nitro-icon icon-unset-tile" />
                            </LayoutGridItem>
                        </div>
                        <div className="flex gap-1">
                            <LayoutGridItem itemActive={ (floorAction === FloorAction.UP) } onClick={ event => selectAction(FloorAction.UP) }>
                                <i className="nitro-icon icon-increase-height" />
                            </LayoutGridItem>
                            <LayoutGridItem itemActive={ (floorAction === FloorAction.DOWN) } onClick={ event => selectAction(FloorAction.DOWN) }>
                                <i className="nitro-icon icon-decrease-height" />
                            </LayoutGridItem>
                        </div>
                        <LayoutGridItem itemActive={ (floorAction === FloorAction.DOOR) } onClick={ event => selectAction(FloorAction.DOOR) }>
                            <i className="nitro-icon icon-set-door" />
                        </LayoutGridItem>
                    </Flex>
                </Column>
                <Column alignItems="center" size={ 4 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.enter.direction') }</Text>
                    <i className={ `nitro-icon icon-door-direction-${ visualizationSettings.entryPointDir } cursor-pointer` } onClick={ changeDoorDirection } />
                </Column>
                <Column size={ 3 }>
                    <Text bold>{ LocalizeText('floor.editor.wall.height') }</Text>
                    <div className="flex items-center gap-1">
                        <FaCaretLeft className="cursor-pointer fa-icon" onClick={ decreaseWallHeight } />
                        <input className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm quantity-input" type="number" value={ visualizationSettings.wallHeight } onChange={ event => onWallHeightChange(event.target.valueAsNumber) } />
                        <FaCaretRight className="cursor-pointer fa-icon" onClick={ increaseWallHeight } />
                    </div>
                </Column>
            </Grid>
            <Grid>
                <Column size={ 6 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.tile.height') }: { floorHeight }</Text>
                    <ReactSlider
                        className="nitro-slider"
                        max={ MAX_FLOOR_HEIGHT }
                        min={ MIN_FLOOR_HEIGHT }
                        renderThumb={ ({ style, ...rest }, state) => <div style={ { backgroundColor: `#${ COLORMAP[state.valueNow.toString(33)] }`, ...style } } { ...rest }>{ state.valueNow }</div> }
                        step={ 1 }
                        value={ floorHeight }
                        onChange={ event => onFloorHeightChange(event) } />
                </Column>
                <Column size={ 6 }>
                    <Text bold>{ LocalizeText('floor.plan.editor.room.options') }</Text>
                    <Flex className="items-center">
                        <select className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm" value={ visualizationSettings.thicknessWall } onChange={ event => onWallThicknessChange(parseInt(event.target.value)) }>
                            <option value={ 0 }>{ LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }</option>
                            <option value={ 1 }>{ LocalizeText('navigator.roomsettings.wall_thickness.thin') }</option>
                            <option value={ 2 }>{ LocalizeText('navigator.roomsettings.wall_thickness.normal') }</option>
                            <option value={ 3 }>{ LocalizeText('navigator.roomsettings.wall_thickness.thick') }</option>
                        </select>
                        <select className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem] form-control-sm" value={ visualizationSettings.thicknessFloor } onChange={ event => onFloorThicknessChange(parseInt(event.target.value)) }>
                            <option value={ 0 }>{ LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }</option>
                            <option value={ 1 }>{ LocalizeText('navigator.roomsettings.floor_thickness.thin') }</option>
                            <option value={ 2 }>{ LocalizeText('navigator.roomsettings.floor_thickness.normal') }</option>
                            <option value={ 3 }>{ LocalizeText('navigator.roomsettings.floor_thickness.thick') }</option>
                        </select>
                    </Flex>
                </Column>
            </Grid>
        </div>
    );
};
