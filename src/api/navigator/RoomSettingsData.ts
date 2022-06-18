import { RoomSettingsDataParser } from '@nitrots/nitro-renderer';

export class RoomSettingsData
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
    public bannedUsers: any[];
    public selectedUserToUnban: number;

    constructor(parser: RoomSettingsDataParser)
    {
        if(!parser) throw new Error('invalid_parser');

        const data = parser.data;

        this.roomId = data.roomId;
        this.roomName = data.name;
        this.roomOriginalName = data.name;
        this.roomDescription = data.description;
        this.categoryId = data.categoryId;
        this.userCount = data.maximumVisitorsLimit;
        this.tags = data.tags;
        this.tradeState = data.tradeMode;
        this.allowWalkthrough = data.allowWalkThrough;

        this.lockState = data.doorMode;
        this.originalLockState = data.doorMode;
        this.password = null;
        this.confirmPassword = null;
        this.allowPets = data.allowPets;
        this.allowPetsEat = data.allowFoodConsume;

        this.usersWithRights = new Map<number, string>();

        this.hideWalls = data.hideWalls;
        this.wallThickness = data.wallThickness;
        this.floorThickness = data.floorThickness;
        this.chatBubbleMode = data.chatSettings.mode;
        this.chatBubbleWeight = data.chatSettings.weight;
        this.chatBubbleSpeed = data.chatSettings.speed;
        this.chatFloodProtection = data.chatSettings.protection;
        this.chatDistance = data.chatSettings.distance;

        this.muteState = data.roomModerationSettings.allowMute;
        this.kickState = data.roomModerationSettings.allowKick;
        this.banState = data.roomModerationSettings.allowBan;
        this.bannedUsers = [];
    }
}
