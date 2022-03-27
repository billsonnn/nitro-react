import { HabboClubLevelEnum } from '@nitrots/nitro-renderer';

export interface IRoomModel
{
    clubLevel: number;
    tileSize: number;
    name: string;
}

export const RoomModels: IRoomModel[] = [
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 104, name: 'a' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 94, name: 'b' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 36, name: 'c' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 84, name: 'd' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 80, name: 'e' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 80, name: 'f' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 416, name: 'i' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 320, name: 'j' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 448, name: 'k' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 352, name: 'l' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 384, name: 'm' },
    { clubLevel: HabboClubLevelEnum.NO_CLUB, tileSize: 372, name: 'n' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 80, name: 'g' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 74, name: 'h' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 416, name: 'o' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 352, name: 'p' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 304, name: 'q' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 336, name: 'r' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 748, name: 'u' },
    { clubLevel: HabboClubLevelEnum.CLUB, tileSize: 438, name: 'v' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 540, name: 't' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 512, name: 'w' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 396, name: 'x' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 440, name: 'y' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 456, name: 'z' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 208, name: '0' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 1009, name: '1' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 1044, name: '2' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 183, name: '3' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 254, name: '4' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 1024, name: '5' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 801, name: '6' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 354, name: '7' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 888, name: '8' },
    { clubLevel: HabboClubLevelEnum.VIP, tileSize: 926, name: '9' }
];
