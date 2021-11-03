import { UpdateFloorPropertiesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { SendMessageHook, UseMountEffect } from '../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutFlex, NitroLayoutGridColumn } from '../../../layout';
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
        SendMessageHook(new UpdateFloorPropertiesMessageComposer(
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
        <NitroCardView simple={true} className="floorplan-import-export">
            <NitroCardHeaderView headerText={LocalizeText('floor.plan.editor.import.export')} onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <NitroLayoutGridColumn size={ 12 } className="h-100">
                    <textarea className="h-100" value={map} onChange={ event => setMap(event.target.value) }></textarea>
                    <NitroLayoutFlex className="justify-content-between">
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={revertChanges}>{LocalizeText('floor.plan.editor.revert.to.last.received.map')}</button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={saveFloorChanges}>{LocalizeText('floor.plan.editor.save')}</button>
                        </div>
                    </NitroLayoutFlex>
                </NitroLayoutGridColumn>
                
            </NitroCardContentView>
        </NitroCardView>
    )
}

export interface FloorplanImportExportViewProps
{
    onCloseClick(): void;
}
