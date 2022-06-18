import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { UseMessageEventHook } from '../../../../../hooks';
import { HallOfFameItemView } from '../hall-of-fame-item/HallOfFameItemView';
import { HallOfFameWidgetViewProps } from './HallOfFameWidgetView.types';

export const HallOfFameWidgetView: FC<HallOfFameWidgetViewProps> = props =>
{
    const { slot = -1, conf = null } = props;
    const [ data, setData ] = useState<CommunityGoalHallOfFameData>(null);

    const onCommunityGoalHallOfFameMessageEvent = useCallback((event: CommunityGoalHallOfFameMessageEvent) =>
    {
        const parser = event.getParser();

        setData(parser.data);
    }, []);

    UseMessageEventHook(CommunityGoalHallOfFameMessageEvent, onCommunityGoalHallOfFameMessageEvent);

    useEffect(() =>
    {
        const campaign: string = conf ? conf['campaign'] : '';  
        SendMessageComposer(new GetCommunityGoalHallOfFameMessageComposer(campaign));
    }, [ conf ]);

    if(!data) return null;

    return (
        <div className="hall-of-fame d-flex">
            { data.hof && (data.hof.length > 0) && data.hof.map((entry, index) =>
            {
                return <HallOfFameItemView key={ index } data={ entry } level={ (index + 1) } />;
            }
            ) }
        </div>
    );
}
