import { IAvatarInfo } from './IAvatarInfo';

export class AvatarInfoRentableBot implements IAvatarInfo
{
    public static RENTABLE_BOT: string = 'IRBI_RENTABLE_BOT';

    public name: string = '';
    public motto: string = '';
    public webID: number = 0;
    public figure: string = '';
    public badges: string[] = [];
    public carryItem: number = 0;
    public roomIndex: number = 0;
    public amIOwner: boolean = false;
    public amIAnyRoomController: boolean = false;
    public roomControllerLevel: number = 0;
    public ownerId: number = -1;
    public ownerName: string = '';
    public botSkills: number[] = [];

    constructor(public readonly type: string)
    {}
}
