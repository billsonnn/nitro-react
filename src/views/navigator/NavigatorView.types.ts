import { RoomDataParser } from 'nitro-renderer';
export interface NavigatorViewProps
{}

export interface INavigatorContext
{
    onTryVisitRoom: (roomData: RoomDataParser) => void;
}
