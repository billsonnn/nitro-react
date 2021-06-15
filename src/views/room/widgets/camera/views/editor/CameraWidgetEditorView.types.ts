import { RoomCameraWidgetEditorEffect } from '../../../../../../../../nitro-renderer/src/nitro/room/camera-widget/RoomCameraWidgetEditorEffect';

export interface CameraWidgetEditorViewProps
{
    onCloseClick: () => void;
    picture: HTMLImageElement;
    availableEffects: RoomCameraWidgetEditorEffect[];
}

export class CameraWidgetEditorTabs
{
    public static readonly COLORMATRIX: string  = 'colormatrix';
    public static readonly COMPOSITE: string    = 'composite';
}
