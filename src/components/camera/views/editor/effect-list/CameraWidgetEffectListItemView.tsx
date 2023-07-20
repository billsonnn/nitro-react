import { IRoomCameraWidgetEffect } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { FaLock, FaTimes } from 'react-icons/fa';
import { LocalizeText } from '../../../../../api';
import { Button, LayoutGridItem, Text } from '../../../../../common';

export interface CameraWidgetEffectListItemViewProps
{
    effect: IRoomCameraWidgetEffect;
    thumbnailUrl: string;
    isActive: boolean;
    isLocked: boolean;
    selectEffect: () => void;
    removeEffect: () => void;
}

export const CameraWidgetEffectListItemView: FC<CameraWidgetEffectListItemViewProps> = props =>
{
    const { effect = null, thumbnailUrl = null, isActive = false, isLocked = false, selectEffect = null, removeEffect = null } = props;

    return (
        <LayoutGridItem title={ LocalizeText(!isLocked ? (`camera.effect.name.${ effect.name }`) : `camera.effect.required.level ${ effect.minLevel }`) } itemActive={ isActive } onClick={ event => (!isActive && selectEffect()) }>
            { isActive &&
                <Button variant="danger" className="rounded-circle remove-effect" onClick={ removeEffect }>
                    <FaTimes className="fa-icon" />
                </Button> }
            { !isLocked && (thumbnailUrl && thumbnailUrl.length > 0) &&
                <div className="effect-thumbnail-image border">
                    <img alt="" src={ thumbnailUrl } />
                </div> }
            { isLocked &&
                <Text center bold>
                    <div>
                        <FaLock className="fa-icon" />
                    </div>
                    { effect.minLevel }
                </Text> }
        </LayoutGridItem>
    );
}
