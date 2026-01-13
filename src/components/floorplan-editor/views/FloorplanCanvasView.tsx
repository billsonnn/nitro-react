import { GetOccupiedTilesMessageComposer, GetRoomEntryTileMessageComposer, NitroPoint, RoomEntryTileMessageEvent, RoomOccupiedTilesMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useRef, useState } from "react"
import { SendMessageComposer } from "../../../api"
import { ColumnProps } from "../../../common"
import { useMessageEvent } from "../../../hooks"
import { useFloorplanEditorContext } from "../FloorplanEditorContext"
import { FloorplanEditor } from "../common/FloorplanEditor"

export const FloorplanCanvasView: FC<ColumnProps> = props => {
    const { gap = 1, children = null, ...rest } = props
    const [ occupiedTilesReceived, setOccupiedTilesReceived ] = useState(false)
    const [ entryTileReceived, setEntryTileReceived ] = useState(false)
    const [ isZoomedIn, setIsZoomedIn ] = useState(false)
    const { originalFloorplanSettings = null, setOriginalFloorplanSettings = null, setVisualizationSettings = null } = useFloorplanEditorContext()
    const elementRef = useRef<HTMLDivElement>(null)

    useMessageEvent<RoomOccupiedTilesMessageEvent>(RoomOccupiedTilesMessageEvent, event => {
        const parser = event.getParser()

        setOriginalFloorplanSettings(prevValue => {
            const newValue = { ...prevValue }

            newValue.reservedTiles = parser.blockedTilesMap

            FloorplanEditor.instance.setTilemap(newValue.tilemap, newValue.reservedTiles)

            return newValue
        })

        setOccupiedTilesReceived(true)

        const scrollAmount = (FloorplanEditor.instance.view.width / 3)
        elementRef.current.scrollLeft += scrollAmount
    })

    useMessageEvent<RoomEntryTileMessageEvent>(RoomEntryTileMessageEvent, event => {
        const parser = event.getParser()

        setOriginalFloorplanSettings(prevValue => {
            const newValue = { ...prevValue }

            newValue.entryPoint = [ parser.x, parser.y ]
            newValue.entryPointDir = parser.direction

            return newValue
        })

        setVisualizationSettings(prevValue => {
            const newValue = { ...prevValue }

            newValue.entryPointDir = parser.direction

            return newValue
        })

        FloorplanEditor.instance.doorLocation = new NitroPoint(parser.x, parser.y)

        setEntryTileReceived(true)
    })

    const handleZoom = () => {
        const currentScale = FloorplanEditor.instance.tilemapRenderer.scale.x

        if (!isZoomedIn) {
            const newScale = currentScale * 1.5
            FloorplanEditor.instance.tilemapRenderer.scale.set(newScale)
        } else {
            const newScale = currentScale / 1.5
            FloorplanEditor.instance.tilemapRenderer.scale.set(newScale)
        }

        FloorplanEditor.instance.renderTiles()

        setIsZoomedIn(prevState => !prevState)
    }

    useEffect(() => {
        return () => {
            FloorplanEditor.instance.clear()

            setVisualizationSettings(prevValue => {
                return {
                    wallHeight: originalFloorplanSettings.wallHeight,
                    thicknessWall: originalFloorplanSettings.thicknessWall,
                    thicknessFloor: originalFloorplanSettings.thicknessFloor,
                    entryPointDir: prevValue.entryPointDir
                }
            })
        }
    }, [ originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.wallHeight, setVisualizationSettings ])

    useEffect(() => {
        if (!entryTileReceived || !occupiedTilesReceived) return

        FloorplanEditor.instance.renderTiles()
    }, [ entryTileReceived, occupiedTilesReceived ])

    useEffect(() => {
        SendMessageComposer(new GetRoomEntryTileMessageComposer())
        SendMessageComposer(new GetOccupiedTilesMessageComposer())

        FloorplanEditor.instance.tilemapRenderer.interactive = true

        if (!elementRef.current) return

        elementRef.current.appendChild(FloorplanEditor.instance.renderer.view)

        const initialScale = isZoomedIn ? 1 : 0.6
        FloorplanEditor.instance.tilemapRenderer.scale.set(initialScale)
        FloorplanEditor.instance.renderTiles()
    }, [ isZoomedIn ])

    return (
        <div className="relative flex overflow-hidden">
            <div className="illumina-scrollbar big-scroll !overflow-scroll !pr-0" ref={elementRef} />
            <button className="absolute bottom-5 left-2 z-10 text-white" onClick={handleZoom}>
                <i className="block h-5 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-442px_-125px]" />
            </button>
            {children}
        </div>
    )
}