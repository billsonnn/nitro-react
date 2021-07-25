import { GetPromoArticlesComposer, PromoArticleData, PromoArticlesMessageEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { PromoArticleWidgetViewProps } from './PromoArticleWidgetView.types';

export const PromoArticleWidgetView: FC<PromoArticleWidgetViewProps> = props =>
{
	const [articles, setArticles] = useState<PromoArticleData[]>(null);
  	const [index, setIndex] = useState(0);

  	const handleSelect = (selectedIndex) => 
  	{
    	setIndex(selectedIndex);
  	};

  	useEffect(() =>
  	{
    	SendMessageHook(new GetPromoArticlesComposer());
  	}, []);

  	const onPromoArticlesMessageEvent = useCallback((event: PromoArticlesMessageEvent) =>
  	{
    	const parser = event.getParser();
    	setArticles(parser.articles);
  	}, []);

  	CreateMessageHook(PromoArticlesMessageEvent, onPromoArticlesMessageEvent);

  	if (!articles) return null;

  	return (
		<div className="promo-articles widget">
			<div className="d-flex flex-row align-items-center w-100 mb-1">
				<small className="flex-shrink-0 pe-1">{ LocalizeText('landing.view.promo.article.header') }</small>
			  	<hr className="w-100 my-0"/>
			</div>
		  	<div className="d-flex flex-row mb-1">
				{articles && (articles.length > 0) && articles.map((article, ind) =>
					<div className={`promo-articles-bullet ` + (article === articles[index] ? 'promo-articles-bullet-active' : '')} key={article.id} onClick={event => handleSelect(ind)} />
				)}
			</div>
    		{articles && articles[index] &&
				<div className="promo-article d-flex flex-row row mx-0">
			  		<div className="promo-article-image" style={ {backgroundImage: `url(${articles[index].imageUrl})`} }/>
					<div className="col-3">
						<h3 className="my-0">{articles[index].title}</h3>
						<b>{ articles[index].bodyText }</b>
					</div>
          		</div>
       		}
    	</div>
  	);
}
