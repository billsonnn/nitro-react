import { RoomWidgetUpdateInfostandPetEvent } from '../../../../events';

export interface AvatarInfoWidgetPetViewProps
{
    petData: RoomWidgetUpdateInfostandPetEvent;
    close: () => void;
}
