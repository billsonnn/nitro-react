import { FC } from 'react';
import { BonusRareWidgetView } from './bonus-rare/BonusRareWidgetView';
import { HallOfFameWidgetView } from './hall-of-fame/HallOfFameWidgetView';
import { PromoArticleWidgetView } from './promo-article/PromoArticleWidgetView';
import { WidgetContainerView } from './widget-container/WidgetContainerView';

export interface GetWidgetLayoutProps
{
    widgetType: string;
    slot: number;
    widgetConf: any;
}

export const GetWidgetLayout: FC<GetWidgetLayoutProps> = props =>
{
    switch(props.widgetType)
    {
        case 'promoarticle':
            return <PromoArticleWidgetView />;
        case 'achievementcompetition_hall_of_fame':
            return <HallOfFameWidgetView slot={ props.slot } conf={ props.widgetConf } />;
        case 'bonusrare':
            return <BonusRareWidgetView />;
        case 'widgetcontainer':
            return <WidgetContainerView conf={ props.widgetConf } />
        default:
            return null;
    }
}
