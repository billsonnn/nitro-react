import RoomSettingsData from '../../../common/RoomSettingsData';

export class NavigatorRoomSettingsTabViewProps
{
    roomSettingsData: RoomSettingsData;
    handleChange: (field: string, value: string | number | boolean) => void;
}
