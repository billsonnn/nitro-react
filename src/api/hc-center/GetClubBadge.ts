const DEFAULT_BADGE: string = 'HC1';
const BADGES: string[] = [ 'ACH_VipHC1', 'ACH_VipHC2', 'ACH_VipHC3', 'ACH_VipHC4', 'ACH_VipHC5', 'HC1', 'HC2', 'HC3', 'HC4', 'HC5' ];

export const GetClubBadge = (badgeCodes: string[]) =>
{
    let badgeCode: string = null;

    BADGES.forEach(badge => ((badgeCodes.indexOf(badge) > -1) && (badgeCode = badge)));

    return (badgeCode || DEFAULT_BADGE);
};
