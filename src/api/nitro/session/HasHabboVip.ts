import { HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { GetSessionDataManager } from './GetSessionDataManager';

export function HasHabboVip(): boolean
{
    return (GetSessionDataManager().clubLevel >= HabboClubLevelEnum.VIP);
}
