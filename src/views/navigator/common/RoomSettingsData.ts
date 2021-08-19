import { RoomSettingsParser } from '@nitrots/nitro-renderer';

export default class RoomSettingsData
{
    public roomId: number;
    public roomName: string;
    public roomOriginalName: string;
    public roomDescription: string;
    public categoryId: number;
    public userCount: number;
    public tags: string[];
    public tradeState: number;
    public allowWalkthrough: boolean;

    public lockState: number;
    public originalLockState: number;
    public password: string;
    public confirmPassword: string;
    public allowPets: boolean;
    public allowPetsEat: boolean;

    public usersWithRights: Map<number, string>;

    public hideWalls: boolean;
    public wallThickness: number;
    public floorThickness: number;
    public chatBubbleMode: number;
    public chatBubbleWeight: number;
    public chatBubbleSpeed: number;
    public chatFloodProtection: number;
    public chatDistance: number;

    public muteState: number;
    public kickState: number;
    public banState: number;
    public bannedUsers: Map<number, string>;
    public selectedUserToUnban: number;

    constructor(parser: RoomSettingsParser)
    {
        if(!parser) throw new Error('invalid_parser');

        this.roomId                 = parser.roomId;
        this.roomName               = parser.name;
        this.roomOriginalName       = parser.name;
        this.roomDescription        = parser.description;
        this.categoryId             = parser.categoryId;
        this.userCount              = parser.userCount;
        this.tags                   = parser.tags;
        this.tradeState             = parser.tradeMode;
        this.allowWalkthrough       = parser.allowWalkthrough;

        this.lockState              = parser.state;
        this.originalLockState      = parser.state;
        this.password               = null;
        this.confirmPassword        = null;
        this.allowPets              = parser.allowPets;
        this.allowPetsEat           = parser.allowPetsEat;

        this.usersWithRights        = new Map<number, string>();

        this.hideWalls              = parser.hideWalls;
        this.wallThickness          = parser.thicknessWall;
        this.floorThickness         = parser.thicknessFloor;
        this.chatBubbleMode         = parser.chatSettings.mode;
        this.chatBubbleWeight       = parser.chatSettings.weight;
        this.chatBubbleSpeed        = parser.chatSettings.speed;
        this.chatFloodProtection    = parser.chatSettings.protection;
        this.chatDistance           = parser.chatSettings.distance;

        this.muteState              = parser.moderationSettings.allowMute;
        this.kickState              = parser.moderationSettings.allowKick;
        this.banState               = parser.moderationSettings.allowBan;
        this.bannedUsers            = new Map<number, string>();
    }
}
