import { IRoomCameraWidgetEffect, IRoomCameraWidgetSelectedEffect } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CameraPictureThumbnail } from '../../../../../api';
import { Grid } from '../../../../../common';
import { CameraWidgetEffectListItemView } from './CameraWidgetEffectListItemView';

export interface CameraWidgetEffectListViewProps
{
    myLevel: number;
    selectedEffects: IRoomCameraWidgetSelectedEffect[];
    effects: IRoomCameraWidgetEffect[];
    thumbnails: CameraPictureThumbnail[];
    processAction: (type: string, name: string) => void;
}

export const CameraWidgetEffectListView: FC<CameraWidgetEffectListViewProps> = props =>
{
    const { myLevel = 0, selectedEffects = [], effects = [], thumbnails = [], processAction = null } = props;

    return (
        <Grid columnCount={ 3 } overflow="auto">
            { effects && (effects.length > 0) && effects.map((effect, index) =>
            {
                const thumbnailUrl = (thumbnails.find(thumbnail => (thumbnail.effectName === effect.name)));
                const isActive = (selectedEffects.findIndex(selectedEffect => (selectedEffect.effect.name === effect.name)) > -1);

                return <CameraWidgetEffectListItemView key={ index } effect={ effect } thumbnailUrl={ ((thumbnailUrl && thumbnailUrl.thumbnailUrl) || null) } isActive={ isActive } isLocked={ (effect.minLevel > myLevel) } selectEffect={ () => processAction('select_effect', effect.name) } removeEffect={ () => processAction('remove_effect', effect.name) } />
            }) }
        </Grid>
    );
}
