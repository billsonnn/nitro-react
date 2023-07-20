import { AvatarAction, IQuestion, RoomSessionWordQuizEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { GetRoomEngine, VoteValue } from '../../../api';
import { useRoomSessionManagerEvent } from '../../events';
import { useRoom } from '../useRoom';
import { usePollWidget } from './usePollWidget';

const DEFAULT_DISPLAY_DELAY = 4000;
const SIGN_FADE_DELAY = 3;

const useWordQuizWidgetState = () =>
{
    const [ pollId, setPollId ] = useState(-1);
    const [ question, setQuestion ] = useState<IQuestion>(null);
    const [ answerSent, setAnswerSent ] = useState(false);
    const [ questionClearTimeout, setQuestionClearTimeout ] = useState<ReturnType<typeof setTimeout>>(null);
    const [ answerCounts, setAnswerCounts ] = useState<Map<string, number>>(new Map());
    const [ userAnswers, setUserAnswers ] = useState<Map<number, VoteValue>>(new Map());
    const { answerPoll = null } = usePollWidget();
    const { roomSession = null } = useRoom();

    const clearQuestion = () =>
    {
        setPollId(-1);
        setQuestion(null);
    }

    const vote = (vote: string) =>
    {
        if(answerSent || !question) return;

        answerPoll(pollId, question.id, [ vote ]);

        setAnswerSent(true);
    }

    useRoomSessionManagerEvent<RoomSessionWordQuizEvent>(RoomSessionWordQuizEvent.ANSWERED, event =>
    {
        const userData = roomSession.userDataManager.getUserData(event.userId);

        if(!userData) return;

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

        GetRoomEngine().updateRoomObjectUserGesture(roomSession.roomId, userData.roomIndex, AvatarAction.getGestureId((event.value === '0') ? AvatarAction.GESTURE_SAD : AvatarAction.GESTURE_SMILE));
    });

    useRoomSessionManagerEvent<RoomSessionWordQuizEvent>(RoomSessionWordQuizEvent.FINISHED, event =>
    {
        if(question && (question.id === event.questionId))
        {
            setAnswerCounts(event.answerCounts);
            setAnswerSent(true);

            setQuestionClearTimeout(prevValue =>
            {
                if(prevValue) clearTimeout(prevValue);

                return setTimeout(() => clearQuestion(), DEFAULT_DISPLAY_DELAY);
            });
        }

        setUserAnswers(new Map());
    });

    useRoomSessionManagerEvent<RoomSessionWordQuizEvent>(RoomSessionWordQuizEvent.QUESTION, event =>
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

                return setTimeout(() => clearQuestion(), delay);
            }

            return null;
        });
    });

    useEffect(() =>
    {
        const checkSignFade = () =>
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
        }

        const interval = setInterval(() => checkSignFade(), 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() =>
    {
        return () =>
        {
            setQuestionClearTimeout(prevValue =>
            {
                if(prevValue) clearTimeout(prevValue);

                return null;
            });
        }
    }, []);

    return { question, answerSent, answerCounts, userAnswers, vote };
}

export const useWordQuizWidget = useWordQuizWidgetState;
