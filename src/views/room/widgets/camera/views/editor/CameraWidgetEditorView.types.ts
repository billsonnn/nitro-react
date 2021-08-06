import { IRoomCameraWidgetEffect } from '@nitrots/nitro-renderer';

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
