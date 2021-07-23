import { GetPromoArticlesComposer, PromoArticleData, PromoArticlesMessageEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { PromoArticleWidgetViewProps } from './PromoArticleWidgetView.types';

export const PromoArticleWidgetView: FC<PromoArticleWidgetViewProps> = props =>
{
  const [articles, setArticles] = useState<PromoArticleData[]>(null);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => 
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
    <div className="promo-article widget">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {articles && (articles.length > 0) && articles.map(article =>
          <Carousel.Item key={article.id.toString()}>
            <img
              className="d-block"
              src={article.imageUrl}
              alt={article.title}
            />
            <Carousel.Caption>
              <h3>{article.title}</h3>
              <p>{article.bodyText}</p>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
}
