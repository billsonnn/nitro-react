import { GetSessionDataManager, HabboClubLevelEnum } from '@nitrots/nitro-renderer';

export function HasHabboClub(): boolean
{
    return (GetSessionDataManager().clubLevel >= HabboClubLevelEnum.CLUB);
}
