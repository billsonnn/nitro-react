import { CommunityGoalHallOfFameData, CommunityGoalHallOfFameMessageEvent, GetCommunityGoalHallOfFameMessageComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages/message-event';
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
  
  if(!data) return null;
  
  return (
    <div className="hall-of-fame widget">
      <h1>showing hall of fame for event: {data ? data.goalCode : 'empty'}</h1>
    </div>
  );
}
