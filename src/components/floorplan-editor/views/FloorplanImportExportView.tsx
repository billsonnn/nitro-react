import { UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../common';
import { UseMountEffect } from '../../../hooks';
import { ConvertTileMapToString } from '../common/ConvertMapToString';
import { convertNumbersForSaving } from '../common/Utils';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';

interface FloorplanImportExportViewProps
{
    onCloseClick(): void;
}

export const FloorplanImportExportView: FC<FloorplanImportExportViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const [ map, setMap ] = useState<string>('');
    const { originalFloorplanSettings = null } = useFloorplanEditorContext();

    const saveFloorChanges = () =>
    {
        SendMessageComposer(new UpdateFloorPropertiesMessageComposer(
            map.split('\n').join('\r'),
            originalFloorplanSettings.entryPoint[0],
            originalFloorplanSettings.entryPoint[1],
            originalFloorplanSettings.entryPointDir,
            convertNumbersForSaving(originalFloorplanSettings.thicknessWall),
            convertNumbersForSaving(originalFloorplanSettings.thicknessFloor),
            originalFloorplanSettings.wallHeight - 1
        ));
    }

    UseMountEffect(() =>
    {
        setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap));  
    });

    return (
        <NitroCardView theme="primary-slim" className="floorplan-import-export">
            <NitroCardHeaderView headerText={ LocalizeText('floor.plan.editor.import.export') } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <textarea className="h-100" value={ map } onChange={ event => setMap(event.target.value) } />
                <Flex justifyContent="between">
                    <Button onClick={ event => setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap)) }>
                        { LocalizeText('floor.plan.editor.revert.to.last.received.map') }
                    </Button>
                    <Button onClick={ saveFloorChanges }>
                        { LocalizeText('floor.plan.editor.save') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
