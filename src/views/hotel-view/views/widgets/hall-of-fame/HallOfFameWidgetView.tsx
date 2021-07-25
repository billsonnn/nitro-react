import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { HallOfFameWidgetViewProps } from './HallOfFameWidgetView.types';

export const HallOfFameWidgetView: FC<HallOfFameWidgetViewProps> = props =>
{
    const [data, setData] = useState<CommunityGoalHallOfFameData>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetCommunityGoalHallOfFameMessageComposer(props.conf));
    }, [props.conf]);

    const onCommunityGoalHallOfFameMessageEvent = useCallback((event: CommunityGoalHallOfFameMessageEvent) =>
    {
        const parser = event.getParser();
        setData(parser.data);
    }, []);

    CreateMessageHook(CommunityGoalHallOfFameMessageEvent, onCommunityGoalHallOfFameMessageEvent);

    if (!data) return null;

    return (
        <div className="hall-of-fame widget">
        {data.hof && (data.hof.length > 0) && data.hof.map((entry, ind) =>
            <div className="hof-user-container cursor-pointer">
                <div className="hof-tooltip">
                    <div className="hof-tooltip-content">
                        <div className="fw-bold">{ind + 1}. { entry.userName }</div>
                        <div className="muted fst-italic small text-center">{LocalizeText('landing.view.competition.hof.points', ['points'], [entry.currentScore.toString()])}</div>
                    </div>
                </div>
                <AvatarImageView figure={entry.figure} direction={2} key={ind} />
            </div>
        )}
        </div>
    );
}
