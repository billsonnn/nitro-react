import { RoomDataParser } from '@nitrots/nitro-renderer';

export interface NavigatorData
{
    homeRoomId: number;
    settingsReceived: boolean;
    enteredGuestRoom: RoomDataParser;
    currentRoomOwner: boolean;
    currentRoomId: number;
    currentRoomIsStaffPick: boolean;
    createdFlatId: number;
    avatarId: number;
    roomPicker: boolean;
    eventMod: boolean;
    currentRoomRating: number;
    canRate: boolean;
}
