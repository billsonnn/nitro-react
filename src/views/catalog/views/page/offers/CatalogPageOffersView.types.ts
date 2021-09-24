import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { DetailsHTMLAttributes } from 'react';

export interface CatalogPageOffersViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    offers: CatalogPageMessageOfferData[];
}
