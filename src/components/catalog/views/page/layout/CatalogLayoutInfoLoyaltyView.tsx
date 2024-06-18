import { FC } from 'react';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutInfoLoyaltyView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    return (
        <div className="h-full nitro-catalog-layout-info-loyalty text-black flex flex-row">
            <div className="overflow-auto h-full flex flex-col info-loyalty-content">
                <div dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
            </div>
        </div>
    );
};
