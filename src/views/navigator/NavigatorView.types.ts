import { RoomDataParser } from '@nitrots/nitro-renderer';
export interface NavigatorViewProps
{}

export interface INavigatorContext
{
    onTryVisitRoom: (roomData: RoomDataParser) => void;
}
