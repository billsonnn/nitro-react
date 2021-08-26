import { NitroEvent } from '@nitrots/nitro-renderer';

export class FriendListEvent extends NitroEvent
{
    public static SHOW_FRIEND_LIST: string = 'IE_SHOW_FRIEND_LIST';
    public static TOGGLE_FRIEND_LIST: string = 'IE_TOGGLE_FRIEND_LIST';
    public static REQUEST_FRIEND_LIST: string = 'FLSFRE_REQUEST_FRIEND_LIST';
}
