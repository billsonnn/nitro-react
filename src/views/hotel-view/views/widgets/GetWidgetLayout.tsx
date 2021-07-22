import { FC } from 'react';
import { GetWidgetLayoutProps } from './GetWidgetLayout.types';
import { HallOfFameWidgetView } from './hall-of-fame/HallOfFameWidgetView';
import { PromoArticleWidgetView } from './promo-article/PromoArticleWidgetView';

export const GetWidgetLayout: FC<GetWidgetLayoutProps> = props =>
{
  switch(props.widgetType)
  {
    case "news":
      return <PromoArticleWidgetView/>;
    case "hof":
      return <HallOfFameWidgetView/>;
    default:
      return null;
  }
}
