import { FriendParser } from '@nitrots/nitro-renderer';

export class MessengerFriend
{
    public static RELATIONSHIP_NONE: number = 0;
    public static RELATIONSHIP_HEART: number = 1;
    public static RELATIONSHIP_SMILE: number = 2;
    public static RELATIONSHIP_BOBBA: number = 3;

    public id: number = -1;
    public name: string = null;
    public gender: number = 0;
    public online: boolean = false;
    public followingAllowed: boolean = false;
    public figure: string = null;
    public categoryId: number = 0;
    public motto: string = null;
    public realName: string = null;
    public lastAccess: string = null;
    public persistedMessageUser: boolean = false;
    public vipMember: boolean = false;
    public pocketHabboUser: boolean = false;
    public relationshipStatus: number = -1;
    public unread: number = 0;

    public populate(parser: FriendParser): void
    {
        this.id = parser.id;
        this.name = parser.name;
        this.gender = parser.gender;
        this.online = parser.online;
        this.followingAllowed = parser.followingAllowed;
        this.figure = parser.figure;
        this.categoryId = parser.categoryId;
        this.motto = parser.motto;
        this.realName = parser.realName;
        this.lastAccess = parser.lastAccess;
        this.persistedMessageUser = parser.persistedMessageUser;
        this.vipMember = parser.vipMember;
        this.pocketHabboUser = parser.pocketHabboUser;
        this.relationshipStatus = parser.relationshipStatus;
    }
}
