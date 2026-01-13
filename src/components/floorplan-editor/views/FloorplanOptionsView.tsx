import { FC, useState } from "react"
import ReactSlider from "react-slider"
import { LocalizeText } from "../../../api"
import { Button, LayoutAvatarImageView } from "../../../common"
import { useSessionInfo } from "../../../hooks"
import { useFloorplanEditorContext } from "../FloorplanEditorContext"
import { FloorAction } from "../common/Constants"
import { FloorplanEditor } from "../common/FloorplanEditor"

const MIN_WALL_HEIGHT: number = 1
const MAX_WALL_HEIGHT: number = 16

const MIN_FLOOR_HEIGHT: number = 0
const MAX_FLOOR_HEIGHT: number = 26

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { visualizationSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext()
    const [ floorAction, setFloorAction ] = useState(FloorAction.SET)
    const [ floorHeight, setFloorHeight ] = useState(0)
    const { userFigure = null } = useSessionInfo()
    
    const selectAction = (action: number) =>
    {
        setFloorAction(action)

        FloorplanEditor.instance.actionSettings.currentAction = action
    }

    const changeDoorDirection = (isLeft: boolean) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue }

            if(newValue.entryPointDir < 7)
            {
                if(isLeft) {
                    ++newValue.entryPointDir
                } else {
                    --newValue.entryPointDir
                }
            }
            else
            {
                newValue.entryPointDir = 1
            }

            return newValue
        })
    }

    const onFloorHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = 0

        if(value > 26) value = 26

        setFloorHeight(value)

        FloorplanEditor.instance.actionSettings.currentHeight = value.toString(36)
    }

    const onFloorThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.thicknessFloor = value

            return newValue
        })
    }

    const onWallThicknessChange = (value: number) =>
    {
        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.thicknessWall = value
    
            return newValue
        })
    }

    const onWallHeightChange = (value: number) =>
    {
        if(isNaN(value) || (value <= 0)) value = MIN_WALL_HEIGHT

        if(value > MAX_WALL_HEIGHT) value = MAX_WALL_HEIGHT

        setVisualizationSettings(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.wallHeight = value

            return newValue
        })
    }

    const increaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight + 1)

        if(height > MAX_WALL_HEIGHT) height = MAX_WALL_HEIGHT

        onWallHeightChange(height)
    }

    const decreaseWallHeight = () =>
    {
        let height = (visualizationSettings.wallHeight - 1)

        if(height <= 0) height = MIN_WALL_HEIGHT

        onWallHeightChange(height)
    }

    return (
        <div className="flex flex-col">
            <div className="mb-2.5 flex gap-3">
                <div className="illumina-previewer p-2">
                    <div className="mb-4">
                        <p className="mb-2 text-[13px]">{ LocalizeText("floor.plan.editor.draw.mode") }</p>
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <Button className={`h-[42px] w-[51px] ${(floorAction === FloorAction.SET) ? "active" : ""}`} onClick={ event => selectAction(FloorAction.SET) }>
                                    <i className="h-4 w-[30px] bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[-13px_-20px]" />
                                </Button>
                                <Button className={`h-[42px] w-[51px] ${(floorAction === FloorAction.UNSET) ? "active" : ""}`} onClick={ event => selectAction(FloorAction.UNSET) }>
                                    <i className="h-4 w-[33px] bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[-44px_-20px]" />
                                </Button>
                            </div>
                            <div className="h-[42px] w-0.5 border-r border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            <div className="flex items-center gap-2.5">
                                <Button className={`h-[42px] w-[51px] ${(floorAction === FloorAction.UP) ? "active" : ""}`} onClick={ event => selectAction(FloorAction.UP) }>
                                    <i className="h-[23px] w-7 bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[-78px_-20px]" />
                                </Button>
                                <Button className={`h-[42px] w-[51px] ${(floorAction === FloorAction.DOWN) ? "active" : ""}`} onClick={ event => selectAction(FloorAction.DOWN) }>
                                    <i className="h-[26px] w-7 bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[-107px_-20px]" />
                                </Button>
                            </div>
                            <div className="h-[42px] w-0.5 border-r border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            <Button className={`h-[42px] w-[51px] ${(floorAction === FloorAction.DOOR) ? "active" : ""}`} onClick={ event => selectAction(FloorAction.DOOR) }>
                                <i className="h-[25px] w-[34px] bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[-136px_-20px]" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <p className="mb-1 text-[13px]">{ LocalizeText("floor.plan.editor.tile.height") }</p>
                        <ReactSlider
                            className="h-[19px] w-[284px] bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')]"
                            min={ MIN_FLOOR_HEIGHT }
                            max={ MAX_FLOOR_HEIGHT }
                            step={ 1 }
                            value={ floorHeight }
                            onChange={ event => onFloorHeightChange(event) }
                            renderThumb={ (props, state) => <div { ...props }>
                                <i className="-ml-px mt-1.5 block h-4 w-3 bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[0px_-20px]" />
                            </div> }
                        />
                    </div>
                </div>
                <div className="illumina-previewer flex w-full flex-col p-2">
                    <div className="flex">
                        <div>
                            <div className="mb-2 text-[13px]">{ LocalizeText("floor.plan.editor.enter.direction") }</div>
                            <div className="ml-1.5 flex items-center">
                                <Button className="!w-[26px] !px-0" onClick={ () => changeDoorDirection(true) }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-118px]" />
                                </Button>
                                <div className="relative h-[50px] w-10">
                                    <LayoutAvatarImageView figure={ userFigure } direction={ visualizationSettings.entryPointDir } className="absolute -left-5 top-[-30px] !h-[100px] !w-20 scale-50 overflow-hidden !bg-[center_-21px]" />
                                </div>
                                <i className={ `icon icon-door-direction-${ visualizationSettings.entryPointDir } cursor-pointer` } />
                                <Button className="!w-[26px] !px-0" onClick={ () => changeDoorDirection(false) }>
                                    <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                                </Button>
                            </div>
                        </div>
                        <div className="ml-6 mr-3 h-[97px] w-0.5 border-r border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <div>
                            <p className="mb-2 text-[13px]">{ LocalizeText("floor.plan.editor.room.options") }</p>
                            <div className="flex flex-col gap-1.5">
                                <div className="illumina-card-filter relative flex h-6 w-fit items-center gap-[3px] px-2.5">
                                    <select className="text-[13px]" value={ visualizationSettings.thicknessWall } onChange={ event => onWallThicknessChange(parseInt(event.target.value)) }>
                                        <option className="!text-black" value={ 0 }>{ LocalizeText("navigator.roomsettings.wall_thickness.thinnest") }</option>
                                        <option className="!text-black" value={ 1 }>{ LocalizeText("navigator.roomsettings.wall_thickness.thin") }</option>
                                        <option className="!text-black" value={ 2 }>{ LocalizeText("navigator.roomsettings.wall_thickness.normal") }</option>
                                        <option className="!text-black" value={ 3 }>{ LocalizeText("navigator.roomsettings.wall_thickness.thick") }</option>
                                    </select>
                                    <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px] bg-no-repeat" />
                                </div>
                                <div className="illumina-card-filter relative flex h-6 w-fit items-center gap-[3px] px-2.5">
                                    <select className="text-[13px]" value={ visualizationSettings.thicknessFloor } onChange={ event => onFloorThicknessChange(parseInt(event.target.value)) }>
                                        <option className="!text-black" value={ 0 }>{ LocalizeText("navigator.roomsettings.floor_thickness.thinnest") }</option>
                                        <option className="!text-black" value={ 1 }>{ LocalizeText("navigator.roomsettings.floor_thickness.thin") }</option>
                                        <option className="!text-black" value={ 2 }>{ LocalizeText("navigator.roomsettings.floor_thickness.normal") }</option>
                                        <option className="!text-black" value={ 3 }>{ LocalizeText("navigator.roomsettings.floor_thickness.thick") }</option>
                                    </select>
                                    <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px] bg-no-repeat" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-9 mt-1.5 flex items-center gap-6">
                        <p className="text-[13px]">{ LocalizeText("floor.editor.wall.height") }</p>
                        <div className="flex items-center gap-2.5">
                            <p className="text-[13px] font-semibold text-[#898989] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ visualizationSettings.wallHeight }</p>
                            <ReactSlider
                                className="h-0.5 w-[111px] border-b border-[#f2f2f2] bg-[#b9b9b9]"
                                min={ MIN_WALL_HEIGHT }
                                max={ MAX_WALL_HEIGHT }
                                step={ 1 }
                                value={ visualizationSettings.wallHeight }
                                onChange={ event => onWallHeightChange(event) }
                                renderThumb={ (props, state) => <div { ...props }>
                                    <i className="-ml-0.5 -mt-1.5 block h-4 w-3 bg-[url('/client-assets/images/floor-plan/spritesheet.png?v=2451779')] bg-[0px_-20px]" />
                                </div> }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
