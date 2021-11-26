import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages/message-event';
import { HallOfFameItemView } from '../hall-of-fame-item/HallOfFameItemView';
import { HallOfFameWidgetViewProps } from './HallOfFameWidgetView.types';

export const HallOfFameWidgetView: FC<HallOfFameWidgetViewProps> = props =>
{
    const { slot = -1, conf = '' } = props;
    const [ data, setData ] = useState<CommunityGoalHallOfFameData>(null);

    const onCommunityGoalHallOfFameMessageEvent = useCallback((event: CommunityGoalHallOfFameMessageEvent) =>
    {
        const parser = event.getParser();

        setData(parser.data);
    }, []);

    CreateMessageHook(CommunityGoalHallOfFameMessageEvent, onCommunityGoalHallOfFameMessageEvent);

    useEffect(() =>
    {
        SendMessageHook(new GetCommunityGoalHallOfFameMessageComposer(conf));
    }, [ conf ]);

    if(!data) return null;

    return (
        <div className="hall-of-fame d-flex">
            { data.hof && (data.hof.length > 0) && data.hof.map((entry, index) =>
                {
                    return <HallOfFameItemView key={ index } data={ entry } level={ (index + 1) } />;
                }
        )}
        </div>
    );
}
