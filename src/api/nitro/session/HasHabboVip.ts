import { GetSessionDataManager, HabboClubLevelEnum } from '@nitrots/nitro-renderer';

export function HasHabboVip(): boolean
{
    return (GetSessionDataManager().clubLevel >= HabboClubLevelEnum.VIP);
}
