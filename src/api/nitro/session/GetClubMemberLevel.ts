import { GetSessionDataManager } from './GetSessionDataManager';

export function GetClubMemberLevel(): number
{
    return GetSessionDataManager().clubLevel;
}
