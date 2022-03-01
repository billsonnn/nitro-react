import { IQuestion } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { RoomWidgetWordQuizUpdateEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetWordQuizUpdateEvent';
import { RoomWidgetPollMessage } from '../../../../api/nitro/room/widgets/messages/RoomWidgetPollMessage';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE, VoteValue } from './common/VoteValue';
import { WordQuizQuestionView } from './WordQuizQuestionView';
import { WordQuizVoteView } from './WordQuizVoteView';

const DEFAULT_DISPLAY_DELAY = 4000;
const SIGN_FADE_DELAY = 3;

export const WordQuizWidgetView: FC<{}> = props =>
{
    const [ pollId, setPollId ] = useState(-1);
    const [ question, setQuestion ] = useState<IQuestion>(null);
    const [ answerSent, setAnswerSent ] = useState(false);
    const [ questionClearTimeout, setQuestionClearTimeout ] = useState<number>(null);
    const [ answerCounts, setAnswerCounts ] = useState<Map<string, number>>(new Map());
    const [ userAnswers, setUserAnswers ] = useState<Map<number, VoteValue>>(new Map());
    const { eventDispatcher = null, widgetHandler = null, roomSession = null } = useRoomContext();

    const clearQuestion = useCallback(() =>
    {
        setPollId(-1);
        setQuestion(null);
    }, []);

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
                    setAnswerCounts(new Map());
                    setUserAnswers(new Map());

                    setQuestionClearTimeout(prevValue =>
                        {
                            if(prevValue) clearTimeout(prevValue);

                            if(event.duration > 0)
                            {
                                const delay = event.duration < 1000 ? DEFAULT_DISPLAY_DELAY : event.duration;
    
                                return setTimeout(() => clearQuestion(), delay) as unknown as number;
                            }
    
                            return null;
                        });
                });
                break;
            case RoomWidgetWordQuizUpdateEvent.QUESTION_ANSWERED: {
                const userData = roomSession.userDataManager.getUserData(event.userId);

                if(!userData) return;

                BatchUpdates(() =>
                {
                    setAnswerCounts(event.answerCounts);

                    setUserAnswers(prevValue =>
                        {
                            if(!prevValue.has(userData.roomIndex))
                            {
                                const newValue = new Map(userAnswers);

                                newValue.set(userData.roomIndex, { value: event.value, secondsLeft: SIGN_FADE_DELAY });

                                return newValue;
                            }

                            return prevValue;
                        });
                });
                break;
            }
            case RoomWidgetWordQuizUpdateEvent.QUESTION_FINISHED:
                if(question && question.id === event.questionId)
                {
                    BatchUpdates(() =>
                    {
                        setAnswerCounts(event.answerCounts);
                        setAnswerSent(true);

                        setQuestionClearTimeout(prevValue =>
                        {
                            if(prevValue) clearTimeout(prevValue);

                            return setTimeout(() => clearQuestion(), DEFAULT_DISPLAY_DELAY) as unknown as number;
                        });
                    });
                }

                setUserAnswers(new Map());
                break;
        }
    }, [ question, roomSession.userDataManager, userAnswers, clearQuestion ]);

    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.NEW_QUESTION, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.QUESTION_ANSWERED, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetWordQuizUpdateEvent.QUESTION_FINISHED, eventDispatcher, onRoomWidgetWordQuizUpdateEvent);

    const vote = useCallback((vote: string) =>
    {
        if(answerSent || !question) return;

        const updateMessage = new RoomWidgetPollMessage(RoomWidgetPollMessage.ANSWER, pollId);

        updateMessage.questionId = question.id;
        updateMessage.answers = [vote];

        widgetHandler.processWidgetMessage(updateMessage);

        setAnswerSent(true);
    }, [ answerSent, pollId, question, widgetHandler ]);

    const checkSignFade = useCallback(() =>
    {
        setUserAnswers(prevValue =>
        {
            const keysToRemove: number[] = [];

            prevValue.forEach((value, key) =>
            {
                value.secondsLeft--;

                if(value.secondsLeft <= 0) keysToRemove.push(key);
            });

            if(keysToRemove.length === 0) return prevValue;

            const copy = new Map(prevValue);

            keysToRemove.forEach(key => copy.delete(key));

            return copy;
        });
    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() => checkSignFade(), 1000);

        return () => clearInterval(interval);
    }, [ checkSignFade ]);

    useEffect(() =>
    {
        return () =>
        {
            setQuestionClearTimeout(prev =>
            {
                if(prev) clearTimeout(prev);

                return null;
            });
        }
    }, []);

    return (
        <>
            { question &&
                <WordQuizQuestionView question={question.content} canVote={!answerSent} vote={vote} noVotes={answerCounts.get(VALUE_KEY_DISLIKE) || 0} yesVotes={answerCounts.get(VALUE_KEY_LIKE) || 0} /> }
            { userAnswers &&
                Array.from(userAnswers.entries()).map(([key, value], index) => <WordQuizVoteView key={index} userIndex={key} vote={value.value} />) }
        </>
    );
}
