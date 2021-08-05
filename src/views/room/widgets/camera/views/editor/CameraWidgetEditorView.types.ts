import { IRoomCameraWidgetEffect } from 'nitro-renderer/src/nitro/camera/IRoomCameraWidgetEffect';

export interface CameraWidgetEditorViewProps
{
    availableEffects: IRoomCameraWidgetEffect[];
    myLevel: number;
    onClose: () => void;
    onCancel: () => void;
    onCheckout: () => void;
}

export class CameraWidgetEditorTabs
{
    public static readonly COLORMATRIX: string  = 'colormatrix';
    public static readonly COMPOSITE: string    = 'composite';
}
