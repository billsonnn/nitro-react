import { FC } from 'react';
import { WiredLayoutViewProps } from '../../../WiredView.types';
import { WiredFurniSelectorView } from '../../furni-selector/WiredFurniSelectorView';

export const WiredActionToggleFurniStateView: FC<WiredLayoutViewProps> = props =>
{
    return (
        <>
            <WiredFurniSelectorView selectedItemsCount={ 0 } maximumItemsCount={ 0 } />
        </>
    );
};
