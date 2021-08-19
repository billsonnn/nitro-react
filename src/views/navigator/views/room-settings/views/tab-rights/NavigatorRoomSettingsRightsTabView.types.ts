import { NavigatorRoomSettingsTabViewProps } from '../../NavigatorRoomSettingsView.types';

export interface NavigatorRoomSettingsRightsTabViewProps extends NavigatorRoomSettingsTabViewProps
{
    friends: Map<number, string>;
}
