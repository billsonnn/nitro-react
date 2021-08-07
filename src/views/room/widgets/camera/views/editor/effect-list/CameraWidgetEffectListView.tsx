import { FC } from 'react';
import { NitroCardGridView } from '../../../../../../../layout/card/grid/NitroCardGridView';
import { CameraWidgetEffectListItemView } from '../effect-list-item/CameraWidgetEffectListItemView';
import { CameraWidgetEffectListViewProps } from './CameraWidgetEffectListView.types';

export const CameraWidgetEffectListView: FC<CameraWidgetEffectListViewProps> = props =>
{
    const { myLevel = 0, selectedEffects = [], effects = [], thumbnails = [], processAction = null } = props;

    return (
        <NitroCardGridView className="effect-grid" columns={ 3 }>
            { effects && (effects.length > 0) && effects.map((effect, index) =>
                {
                    const thumbnailUrl = (thumbnails.find(thumbnail => (thumbnail.effectName === effect.name)));
                    const isActive = (selectedEffects.findIndex(selectedEffect => (selectedEffect.effect.name === effect.name)) > -1);

                    return <CameraWidgetEffectListItemView key={ index } effect={ effect } thumbnailUrl={ ((thumbnailUrl && thumbnailUrl.thumbnailUrl) || null) } isActive={ isActive } isLocked={ (effect.minLevel > myLevel) } selectEffect={ () => processAction('select_effect', effect.name) } removeEffect={ () => processAction('remove_effect', effect.name) } />
                }) }
        </NitroCardGridView>
    );
}
