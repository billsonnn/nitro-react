import { RoomDataParser } from '@nitrots/nitro-renderer';

export interface NavigatorRoomPasswordViewProps
{
    roomData: RoomDataParser;
    state: string;
    onClose: (state: string) => void;
}
