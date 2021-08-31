import { IRoomCameraWidgetEffect, IRoomCameraWidgetSelectedEffect } from '@nitrots/nitro-renderer';
import { CameraPictureThumbnail } from '../../../common/CameraPictureThumbnail';

export interface CameraWidgetEffectListViewProps
{
    myLevel: number;
    selectedEffects: IRoomCameraWidgetSelectedEffect[];
    effects: IRoomCameraWidgetEffect[];
    thumbnails: CameraPictureThumbnail[];
    processAction: (type: string, name: string) => void;
}
