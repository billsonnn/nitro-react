import { FC } from 'react';
import { LocalizeText } from '../../../../../../../api/utils';
import { NitroCardGridItemView } from '../../../../../../../layout/card/grid/item/NitroCardGridItemView';
import { CameraWidgetEffectListItemViewProps } from './CameraWidgetEffectListItemView.types';

export const CameraWidgetEffectListItemView: FC<CameraWidgetEffectListItemViewProps> = props =>
{
    const { effect = null, thumbnailUrl = null, isActive = false, isLocked = false, selectEffect = null, removeEffect = null } = props;

    return (
        <NitroCardGridItemView title={ LocalizeText(!isLocked ? (`camera.effect.name.${ effect.name }`) : `camera.effect.required.level ${ effect.minLevel }`) } itemActive={ isActive } onClick={ event => (!isActive && selectEffect()) }>
            { isActive &&
                <button className="btn btn-danger btn-sm rounded-circle remove-effect" onClick={ removeEffect }>
                    <i className="fas fa-times" />
                </button> }
            { !isLocked && (thumbnailUrl && thumbnailUrl.length > 0) &&
                <div className="effect-thumbnail-image border">
                    <img alt="" src={ thumbnailUrl } />
                </div> }
            { isLocked &&
                <div className="text-center text-black">
                    <div>
                        <i className="fas fa-lock" />
                    </div>
                    <div className="fw-bold">{ effect.minLevel }</div>
                </div> }
        </NitroCardGridItemView>
    );
}
