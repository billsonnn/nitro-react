import { RoomDataParser } from '@nitrots/nitro-renderer';

export interface NavigatorRoomDoorbellViewProps
{
    roomData: RoomDataParser;
    state: string;
    onClose: (state: string) => void;
}
