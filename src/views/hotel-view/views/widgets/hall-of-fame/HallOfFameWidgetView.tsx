import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages/message-event';
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
      <div className="hof-user-container">
        <div className="hof-tooltip">{entry.userName}</div>
        <AvatarImageView figure={entry.figure} direction={2} key={ind} />
      </div>
      )}
    </div>
  );
}
