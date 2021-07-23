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
    public friendsWithoutRights: Map<number, string>;

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

    constructor()
    {
        this.roomId                 = 0;
        this.roomName               = null;
        this.roomOriginalName       = null;
        this.roomDescription        = null;
        this.categoryId             = 0;
        this.userCount              = 0;
        this.tags                   = [];
        this.tradeState             = 0;
        this.allowWalkthrough       = false;

        this.lockState              = 0;
        this.originalLockState      = 0;
        this.password               = null;
        this.confirmPassword        = null;
        this.allowPets              = false;
        this.allowPetsEat           = false;

        this.usersWithRights        = new Map<number, string>();
        this.friendsWithoutRights   = new Map<number, string>();

        this.hideWalls              = false;
        this.wallThickness          = 0;
        this.floorThickness         = 0;
        this.chatBubbleMode         = 0;
        this.chatBubbleWeight       = 0;
        this.chatBubbleSpeed        = 0;
        this.chatFloodProtection    = 0;
        this.chatDistance           = 0;

        this.muteState              = 0;
        this.kickState              = 0;
        this.banState               = 0;
        this.bannedUsers            = new Map<number, string>();
        this.selectedUserToUnban    = 0;
    }

    public selectUserToUnban(userId: number): void
    {
        if(this.selectedUserToUnban === userId)
        {
            this.selectedUserToUnban = 0;
        }
        else
        {
            this.selectedUserToUnban = userId;
        }
    }

    public get selectedUsernameToUnban(): string
    {
        if(this.selectedUserToUnban > 0)
            return this.bannedUsers.get(this.selectedUserToUnban);

        return null;
    }
}
