import { UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../common';
import { UseMountEffect } from '../../../hooks';
import { convertNumbersForSaving } from '../common/Utils';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

export const FloorplanImportExportView: FC<FloorplanImportExportViewProps> = props =>
{
    const { originalFloorplanSettings = null, setOriginalFloorplanSettings = null } = useFloorplanEditorContext();
    
    const { onCloseClick = null } = props;
    const [ map, setMap ] = useState<string>('');

    const convertMapToString = useCallback((map: string) =>
    {
        return map.replace(/\r\n|\r|\n/g, '\n').toLowerCase();
    }, []);

    const revertChanges= useCallback(() =>
    {
        setMap(convertMapToString(originalFloorplanSettings.tilemap));
    }, [convertMapToString, originalFloorplanSettings.tilemap]);

    const saveFloorChanges = useCallback(() =>
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
    }, [map, originalFloorplanSettings.entryPoint, originalFloorplanSettings.entryPointDir, originalFloorplanSettings.thicknessFloor, originalFloorplanSettings.thicknessWall, originalFloorplanSettings.wallHeight]);

    UseMountEffect(() =>
    {
        revertChanges();   
    });

    return (
        <NitroCardView theme="primary-slim" className="floorplan-import-export">
            <NitroCardHeaderView headerText={LocalizeText('floor.plan.editor.import.export')} onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <Column size={ 12 } className="h-100">
                    <textarea className="h-100" value={map} onChange={ event => setMap(event.target.value) }></textarea>
                    <Flex className="justify-content-between">
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={revertChanges}>{LocalizeText('floor.plan.editor.revert.to.last.received.map')}</button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={saveFloorChanges}>{LocalizeText('floor.plan.editor.save')}</button>
                        </div>
                    </Flex>
                </Column>
                
            </NitroCardContentView>
        </NitroCardView>
    )
}

export interface FloorplanImportExportViewProps
{
    onCloseClick(): void;
}
