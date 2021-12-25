
export class BadgeResolver 
{
    public static default_badge: string = 'HC1';
    public static badges: string[] = ['ACH_VipHC1', 'ACH_VipHC2', 'ACH_VipHC3', 'ACH_VipHC4', 'ACH_VipHC5', 'HC1', 'HC2', 'HC3', 'HC4', 'HC5'];


    public static getClubBadge(k: string[]): string
    {
        var badgeCode: string = null;

        this.badges.forEach(badge =>
        {
            if (k.indexOf(badge) > -1)
            {
                badgeCode = badge;
            }
        });

        return badgeCode || this.default_badge;
    }

}
