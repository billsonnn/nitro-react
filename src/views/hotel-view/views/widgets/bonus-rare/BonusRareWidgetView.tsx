import { BonusRareInfoMessageEvent, GetBonusRareInfoMessageComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages/message-event';
import { BonusRareWidgetViewProps } from './BonusRareWidgetView.types';

export const BonusRareWidgetView: FC<BonusRareWidgetViewProps> = props =>
{
  const [productType, setProductType] = useState<string>(null);
  const [productClassId, setProductClassId] = useState<number>(null);
  const [totalCoinsForBonus, setTotalCoinsForBonus] = useState<number>(null);
  const [coinsStillRequiredToBuy, setCoinsStillRequiredToBuy] = useState<number>(null);

  useEffect(() =>
  {
    SendMessageHook(new GetBonusRareInfoMessageComposer());
  }, []);

  const onBonusRareInfoMessageEvent = useCallback((event: BonusRareInfoMessageEvent) =>
  {
    const parser = event.getParser();
    setProductType(parser.productType);
    setProductClassId(parser.productClassId);
    setTotalCoinsForBonus(parser.totalCoinsForBonus);
    setCoinsStillRequiredToBuy(parser.coinsStillRequiredToBuy);
  }, []);

  CreateMessageHook(BonusRareInfoMessageEvent, onBonusRareInfoMessageEvent);

  if(!productType) return (null);
  
  return (<div className="bonus-rare widget">{productType}</div>);
}
