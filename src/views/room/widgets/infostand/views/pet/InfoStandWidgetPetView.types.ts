import { RoomWidgetUpdateInfostandPetEvent } from '../../../../events';

export interface InfoStandWidgetPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}
