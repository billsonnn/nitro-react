import { IQuestion } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { RoomWidgetWordQuizUpdateEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetWordQuizUpdateEvent';
import { RoomWidgetPollMessage } from '../../../../api/nitro/room/widgets/messages/RoomWidgetPollMessage';
import { BatchUpdates, CreateEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../context/RoomContext';
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE, VoteValue } from './common/VoteValue';
import { QuestionView } from './views/question/QuestionView';
import { VoteView } from './views/vote/VoteView';

const DEFAULT_DISPLAY_DELAY = 4000;
const SIGN_FADE_DELAY = 3;

export const WordQuizWidgetView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null, roomSession = null } = useRoomContext();
    const [pollId, setPollId] = useState(-1);
    const [question, setQuestion] = useState<IQuestion>(null);
    const [answerSent, setAnswerSent] = useState(false);
    const [questionClearTimeout, setQuestionClearTimeout] = useState<number>(null);
    const [answerCounts, setAnswerCounts] = useState<Map<string, number>>(new Map());
    const [userAnswers, setUserAnswers] = useState<Map<number, VoteValue>>(new Map());

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
                    if(questionClearTimeout) clearTimeout(questionClearTimeout);
                });

                if(event.duration > 0)
                {
                    const delay = event.duration < 1000 ? DEFAULT_DISPLAY_DELAY : event.duration;
                    setQuestionClearTimeout(prevValue =>
                    {
                        if(prevValue) clearTimeout(prevValue);

                        return setTimeout((clearQuestion as TimerHandler), delay);
                    })
                }
                break;
            case RoomWidgetWordQuizUpdateEvent.QUESTION_ANSWERED:
                const userData = roomSession.userDataManager.getUserData(event.userId);
                if(!userData) return;

                setAnswerCounts(event.answerCounts);

                if(!userAnswers.has(userData.roomIndex))
                {
                    const answersCopy = new Map(userAnswers);
                    answersCopy.set(userData.roomIndex, { value: event.value, secondsLeft: SIGN_FADE_DELAY });
                    setUserAnswers(answersCopy);
                }
                break;
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

                            return setTimeout((clearQuestion as TimerHandler), DEFAULT_DISPLAY_DELAY);
                        });
                    })
                }
                setUserAnswers(new Map());
                break;
        }
    }, [clearQuestion, question, questionClearTimeout, roomSession.userDataManager, userAnswers]);

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

    }, [answerSent, pollId, question, widgetHandler]);

    const checkSignFade = useCallback(() =>
    {
        setUserAnswers(prev =>
        {
            const keysToRemove: number[] = [];
            prev.forEach((value, key) =>
            {
                value.secondsLeft--;

                if(value.secondsLeft <= 0)
                {
                    keysToRemove.push(key);
                }
            });

            if(keysToRemove.length === 0) return prev;

            const copy = new Map(prev);
            keysToRemove.forEach(key => copy.delete(key));
            return copy;
        })

    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            checkSignFade();
        }, 1000)

        return () =>
        {
            clearInterval(interval);
        }
    }, [checkSignFade]);

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
            {question &&
                <QuestionView question={question.content} canVote={!answerSent} vote={vote} noVotes={answerCounts.get(VALUE_KEY_DISLIKE) || 0} yesVotes={answerCounts.get(VALUE_KEY_LIKE) || 0} />
            }
            {userAnswers &&
                Array.from(userAnswers.entries()).map(([key, value], index) =>
                {
                    return <VoteView key={index} userIndex={key} vote={value.value} />
                })
            }
        </>
    );
}
