import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { useMessageEvent } from '../../../../../hooks';
import { HallOfFameItemView } from '../hall-of-fame-item/HallOfFameItemView';
import { HallOfFameWidgetViewProps } from './HallOfFameWidgetView.types';

export const HallOfFameWidgetView: FC<HallOfFameWidgetViewProps> = props =>
{
    const { slot = -1, conf = null } = props;
    const [ data, setData ] = useState<CommunityGoalHallOfFameData>(null);

    useMessageEvent<CommunityGoalHallOfFameMessageEvent>(CommunityGoalHallOfFameMessageEvent, event =>
    {
        const parser = event.getParser();

        setData(parser.data);
    });

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
