import { HabboClubLevelEnum } from 'nitro-renderer';
import { GetSessionDataManager } from './GetSessionDataManager';

export function HasHabboClub(): boolean
{
    return (GetSessionDataManager().clubLevel >= HabboClubLevelEnum.CLUB);
}
