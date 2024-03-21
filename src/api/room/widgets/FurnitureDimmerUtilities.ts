import { GetRoomEngine } from '@nitrots/nitro-renderer';
import { GetRoomSession } from '../../nitro';

export class FurnitureDimmerUtilities
{
    public static AVAILABLE_COLORS: number[] = [ 7665141, 21495, 15161822, 15353138, 15923281, 8581961, 0 ];
    public static HTML_COLORS: string[] = [ '#74F5F5', '#0053F7', '#E759DE', '#EA4532', '#F2F851', '#82F349', '#000000' ];
    public static MIN_BRIGHTNESS: number = 76;
    public static MAX_BRIGHTNESS: number = 255;

    public static savePreset(presetNumber: number, effectTypeId: number, color: number, brightness: number, apply: boolean): void
    {
        GetRoomSession().updateMoodlightData(presetNumber, effectTypeId, color, brightness, apply);
    }

    public static changeState(): void
    {
        GetRoomSession().toggleMoodlightState();
    }

    public static previewDimmer(color: number, brightness: number, bgOnly: boolean): void
    {
        GetRoomEngine().updateObjectRoomColor(GetRoomSession().roomId, color, brightness, bgOnly);
    }

    public static scaleBrightness(value: number): number
    {
        return ~~((((value - this.MIN_BRIGHTNESS) * (100 - 0)) / (this.MAX_BRIGHTNESS - this.MIN_BRIGHTNESS)) + 0);
    }
}
