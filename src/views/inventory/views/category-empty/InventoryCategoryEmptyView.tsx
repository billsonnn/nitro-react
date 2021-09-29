import { FC } from 'react';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { InventoryCategoryEmptyViewProps } from './InventoryCategoryEmptyView.types';

export const InventoryCategoryEmptyView: FC<InventoryCategoryEmptyViewProps> = props =>
{
    const { title = '', desc = '', ...rest } = props;
    
    return (
        <NitroLayoutGrid { ...rest }>
            <NitroLayoutGridColumn className="justify-content-center align-items-center" size={ 5 } overflow="hidden">
                <div className="empty-image" />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn className="justify-content-center" size={ 7 } overflow="hidden">
                <NitroLayoutBase className="text-black text-truncate fs-5 fw-bold">{ title }</NitroLayoutBase>
                <NitroLayoutBase className="text-black" overflow="auto">{ desc }</NitroLayoutBase>
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
