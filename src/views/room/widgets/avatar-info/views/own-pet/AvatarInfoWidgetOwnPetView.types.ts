import { RoomWidgetUpdateInfostandPetEvent } from '../../../../events';

export interface AvatarInfoWidgetOwnPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}
