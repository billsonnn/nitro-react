import RoomSettingsData from '../../common/RoomSettingsData';

export class NavigatorRoomSettingsTabViewProps
{
    roomSettingsData: RoomSettingsData;
    setRoomSettingsData: (roomSettings: RoomSettingsData) => void;
    onSave: (data: RoomSettingsData) => void;
}
