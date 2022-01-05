import { FC } from 'react';
import { NitroCardGridView } from '../../../../../../layout';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export interface CatalogLayoutVipGiftsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutVipGiftsView: FC<CatalogLayoutVipGiftsViewProps> = props =>
{
    return (
        <NitroCardGridView columns={1} className='text-black'>
            
        </NitroCardGridView>
    )
}
