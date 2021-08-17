import { RoomWidgetUpdateInfostandPetEvent } from '../../../../../../api';

export interface InfoStandWidgetPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}
