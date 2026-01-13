import { UpdateFloorPropertiesMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { UseMountEffect } from "../../../hooks"
import { useFloorplanEditorContext } from "../FloorplanEditorContext"
import { ConvertTileMapToString } from "../common/ConvertMapToString"
import { convertNumbersForSaving } from "../common/Utils"

interface FloorplanImportExportViewProps
{
    onCloseClick(): void;
}

export const FloorplanImportExportView: FC<FloorplanImportExportViewProps> = props =>
{
    const { onCloseClick = null } = props
    const [ map, setMap ] = useState<string>("")
    const { originalFloorplanSettings = null } = useFloorplanEditorContext()

    const saveFloorChanges = () =>
    {
        SendMessageComposer(new UpdateFloorPropertiesMessageComposer(
            map.split("\n").join("\r"),
            originalFloorplanSettings.entryPoint[0],
            originalFloorplanSettings.entryPoint[1],
            originalFloorplanSettings.entryPointDir,
            convertNumbersForSaving(originalFloorplanSettings.thicknessWall),
            convertNumbersForSaving(originalFloorplanSettings.thicknessFloor),
            originalFloorplanSettings.wallHeight - 1
        ))
    }

    UseMountEffect(() =>
    {
        setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap))  
    })

    return (
        <NitroCardView uniqueKey="floorplan-editor-import_export" className="illumina-floorplan-editor-import_export w-[380px]">
            <NitroCardHeaderView headerText={ LocalizeText("floor.plan.editor.import.export") } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="illumina-input h-[253px] w-[363px] py-1.5 pr-1">
                    <textarea className="illumina-scrollbar size-full pl-1" spellCheck={ false } value={ map } onChange={ event => setMap(event.target.value) } />
                </div>
                <div className="mt-1 flex justify-between">
                    <Button onClick={ event => setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap)) }>
                        { LocalizeText("floor.plan.editor.revert.to.last.received.map") }
                    </Button>
                    <Button onClick={ saveFloorChanges }>
                        { LocalizeText("floor.plan.editor.save") }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
