import { GetPromoArticlesComposer, PromoArticleData, PromoArticlesMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { LocalizeText, OpenUrl, SendMessageComposer } from "../../../../../api"
import { useMessageEvent } from "../../../../../hooks"

export const PromoArticleWidgetView: FC<{}> = props =>
{
    const [ articles, setArticles ] = useState<PromoArticleData[]>(null)
    const [ index, setIndex ] = useState(0)

    useMessageEvent<PromoArticlesMessageEvent>(PromoArticlesMessageEvent, event =>
    {
        const parser = event.getParser()
        setArticles(parser.articles)
    })

    useEffect(() =>
    {
        SendMessageComposer(new GetPromoArticlesComposer())
    }, [])

    if(!articles) return null

    return (
        <div className="promo-articles widget mb-2">
            <div className="w-100 mb-1 flex items-center">
                <small className="pe-1">{ LocalizeText("landing.view.promo.article.header") }</small>
                <hr className="w-100 my-0"/>
            </div>
            <div className="mb-1 flex">
                { articles && (articles.length > 0) && articles.map((article, ind) =>
                    <div className={ "promo-articles-bullet cursor-pointer " + (article === articles[index] ? "promo-articles-bullet-active" : "") } key={ article.id } onClick={ event => setIndex(ind) } />
                ) }
            </div>
            { articles && articles[index] &&
                <div className="promo-article row mx-0 flex">
                    <div className="promo-article-image" style={ { backgroundImage: `url(${ articles[index].imageUrl })` } }/>
                    <div className="col-3 h-100 flex flex-col">
                        <h3 className="my-0">{ articles[index].title }</h3>
                        <b>{ articles[index].bodyText }</b>
                        <button className="btn btn-sm btn-gainsboro mt-auto" onClick={ event => OpenUrl(articles[index].linkContent) }>{ articles[index].buttonText }</button>
                    </div>
                </div> }
        </div>
    )
}
