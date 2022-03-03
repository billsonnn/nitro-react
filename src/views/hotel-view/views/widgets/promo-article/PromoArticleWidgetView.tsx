import { GetPromoArticlesComposer, PromoArticleData, PromoArticlesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { UseMessageEventHook } from '../../../../../hooks';
import { PromoArticleWidgetViewProps } from './PromoArticleWidgetView.types';

export const PromoArticleWidgetView: FC<PromoArticleWidgetViewProps> = props =>
{
	const [articles, setArticles] = useState<PromoArticleData[]>(null);
  	const [index, setIndex] = useState(0);

  	const handleSelect = (selectedIndex) => 
  	{
    	setIndex(selectedIndex);
  	};

  	const onPromoArticlesMessageEvent = useCallback((event: PromoArticlesMessageEvent) =>
  	{
    	const parser = event.getParser();
    	setArticles(parser.articles);
  	}, []);

  	UseMessageEventHook(PromoArticlesMessageEvent, onPromoArticlesMessageEvent);

	  useEffect(() =>
  	{
    	SendMessageComposer(new GetPromoArticlesComposer());
  	}, []);

  	if(!articles) return null;

  	return (
		<div className="promo-articles widget mb-2">
			<div className="d-flex flex-row align-items-center w-100 mb-1">
				<small className="flex-shrink-0 pe-1">{ LocalizeText('landing.view.promo.article.header') }</small>
			  	<hr className="w-100 my-0"/>
			</div>
		  	<div className="d-flex flex-row mb-1">
				{articles && (articles.length > 0) && articles.map((article, ind) =>
					<div className={'promo-articles-bullet cursor-pointer ' + (article === articles[index] ? 'promo-articles-bullet-active' : '')} key={article.id} onClick={event => handleSelect(ind)} />
				)}
			</div>
    		{articles && articles[index] &&
				<div className="promo-article d-flex flex-row row mx-0">
			  		<div className="promo-article-image" style={ { backgroundImage: `url(${articles[index].imageUrl})` } }/>
					<div className="col-3 d-flex flex-column h-100">
						<h3 className="my-0">{articles[index].title}</h3>
						<b>{ articles[index].bodyText }</b>
						<button className="btn btn-sm mt-auto btn-gainsboro">{ articles[index].buttonText }</button>
					</div>
          		</div>
       		}
    	</div>
  	);
}
