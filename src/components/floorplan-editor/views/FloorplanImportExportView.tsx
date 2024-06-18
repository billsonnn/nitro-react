import { UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../common';
import { useFloorplanEditorContext } from '../FloorplanEditorContext';
import { ConvertTileMapToString } from '../common/ConvertMapToString';
import { convertNumbersForSaving } from '../common/Utils';

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
    };

    useEffect(() =>
    {
        // changed from UseMountEffect
        setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap));
    }, []);

    return (
        <NitroCardView className="floorplan-import-export" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('floor.plan.editor.import.export') } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <textarea className="h-full" value={ map } onChange={ event => setMap(event.target.value) } />
                <div className="flex justify-between">
                    <Button onClick={ event => setMap(ConvertTileMapToString(originalFloorplanSettings.tilemap)) }>
                        { LocalizeText('floor.plan.editor.revert.to.last.received.map') }
                    </Button>
                    <Button onClick={ saveFloorChanges }>
                        { LocalizeText('floor.plan.editor.save') }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
