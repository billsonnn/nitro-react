import { GetPromoArticlesComposer, PromoArticleData, PromoArticlesMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, OpenUrl, SendMessageComposer } from '../../../../../api';
import { useMessageEvent } from '../../../../../hooks';

export const PromoArticleWidgetView: FC<{}> = props =>
{
    const [ articles, setArticles ] = useState<PromoArticleData[]>(null);
    const [ index, setIndex ] = useState(0);

    useMessageEvent<PromoArticlesMessageEvent>(PromoArticlesMessageEvent, event =>
    {
        const parser = event.getParser();
        setArticles(parser.articles);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetPromoArticlesComposer());
    }, []);

    if(!articles) return null;

    return (
        <div className="promo-articles widget mb-2">
            <div className="flex flex-row items-center w-full mb-1">
                <small className="flex-shrink-0 pe-1">{ LocalizeText('landing.view.promo.article.header') }</small>
                <hr className="w-full my-0" />
            </div>
            <div className="flex flex-row mb-1">
                { articles && (articles.length > 0) && articles.map((article, ind) =>
                    <div key={ article.id } className={ 'rounded-[50%] border-[1px] border-[solid] border-[#fff] h-[13px] w-[13px] mr-[3px] cursor-pointer ' + (article === articles[index] ? 'bg-[black]' : ' bg-[white] ') } onClick={ event => setIndex(ind) } />
                ) }
            </div>
            { articles && articles[index] &&
                <div className="grid-cols-2 grid">
                    <div className="promo-article-image w-[150px] h-[150px] mr-[10px] bg-no-repeat bg-[top_center] flex-shrink-0 w-full max-w-full" style={ { backgroundImage: `url(${ articles[index].imageUrl })` } } />
                    <div className="col-span-1 flex flex-col h-full">
                        <h3 className="my-0">{ articles[index].title }</h3>
                        <b>{ articles[index].bodyText }</b>
                        <button className="w-1/2 mt-auto px-[.5rem] py-[.25rem]  rounded-[.2rem] text-[#000] bg-[#d9d9d9] border-[#d9d9d9] [box-shadow:inset_0_2px_#ffffff26,_inset_0_-2px_#0000001a,_0_1px_#0000001a]" onClick={ event => OpenUrl(articles[index].linkContent) }>{ articles[index].buttonText }</button>
                    </div>
                </div> }
        </div>
    );
};
