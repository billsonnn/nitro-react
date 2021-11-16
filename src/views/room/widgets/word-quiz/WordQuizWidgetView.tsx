import { IQuestion } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { RoomWidgetWordQuizUpdateEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetWordQuizUpdateEvent';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { QuestionView } from './views/question/QuestionView';

export const WordQuizWidgetView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [pollId, setPollId ] = useState(-1);
    const [question, setQuestion] = useState<IQuestion>(null);
    const [ answerSent, setAnswerSent ] = useState(false);
    
    const onRoomWidgetWordQuizUpdateEvent = useCallback((event: RoomWidgetWordQuizUpdateEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetWordQuizUpdateEvent.NEW_QUESTION:
                BatchUpdates(() =>
                {
                    setPollId(event.id);
                    setQuestion(event.question);
                    setAnswerSent(false);
                });
                //this._showSignCounters = new Dictionary();
                //this.showNewQuestion(this._question, k.duration);
                break;
        }
    }, []);

    const vote = useCallback((vote: string) =>
    {

    }, []);

    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.NEW_QUESTION, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.QUESTION_ANSWERED, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.QUESTION_FINISHED, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);

    return (
    <>
        {question && <QuestionView question={question.content} canVote={!answerSent} vote={vote}/>}
    </>
    );
}
