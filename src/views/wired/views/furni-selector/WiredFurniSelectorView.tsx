import { FC } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { WiredFurniSelectorViewProps } from './WiredFurniSelectorView.types';

export const WiredFurniSelectorView: FC<WiredFurniSelectorViewProps> = props =>
{
    const { selectedItemsCount = null, maximumItemsCount = null } = props;
    
    return (
        <>
            <hr className="p-0 m-1" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.pickfurnis.caption', ['count', 'limit'], [selectedItemsCount.toString(), maximumItemsCount.toString()]) }</div>
            <div>{ LocalizeText('wiredfurni.pickfurnis.desc') }</div>
            <hr className="p-0 m-1" />
        </>
    );
}
