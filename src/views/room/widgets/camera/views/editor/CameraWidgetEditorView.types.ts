import { IRoomCameraWidgetEffect } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetEffect';

export interface CameraWidgetEditorViewProps
{
    picture: HTMLImageElement;
    availableEffects: IRoomCameraWidgetEffect[];
    onCloseClick: () => void;
}

export class CameraWidgetEditorTabs
{
    public static readonly COLORMATRIX: string  = 'colormatrix';
    public static readonly COMPOSITE: string    = 'composite';
}
