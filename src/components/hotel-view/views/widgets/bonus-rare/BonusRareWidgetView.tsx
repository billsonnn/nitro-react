import { BonusRareInfoMessageEvent, GetBonusRareInfoMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { useMessageEvent } from '../../../../../hooks';

export interface BonusRareWidgetViewProps
{ }

export const BonusRareWidgetView: FC<BonusRareWidgetViewProps> = props =>
{
    const [ productType, setProductType ] = useState<string>(null);
    const [ productClassId, setProductClassId ] = useState<number>(null);
    const [ totalCoinsForBonus, setTotalCoinsForBonus ] = useState<number>(null);
    const [ coinsStillRequiredToBuy, setCoinsStillRequiredToBuy ] = useState<number>(null);

    useMessageEvent<BonusRareInfoMessageEvent>(BonusRareInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        setProductType(parser.productType);
        setProductClassId(parser.productClassId);
        setTotalCoinsForBonus(parser.totalCoinsForBonus);
        setCoinsStillRequiredToBuy(parser.coinsStillRequiredToBuy);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetBonusRareInfoMessageComposer());
    }, []);

    if(!productType) return null;

    return (
        <div className="bonus-rare widget flex">
            { productType }
            <div className="bg-light-dark rounded overflow-hidden relative bonus-bar-container">
                <div className="flex justify-center items-center size-full absolute small top-0">{ (totalCoinsForBonus - coinsStillRequiredToBuy) + '/' + totalCoinsForBonus }</div>
                <div className="small bg-info rounded absolute top-0 h-full" style={ { width: ((totalCoinsForBonus - coinsStillRequiredToBuy) / totalCoinsForBonus) * 100 + '%' } }></div>
            </div>
        </div>
    );
};
