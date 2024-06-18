import { RoomSessionPollEvent } from '@nitrots/nitro-renderer';
import { DispatchUiEvent, RoomWidgetPollUpdateEvent } from '../../../api';
import { useNitroEvent } from '../../events';
import { useRoom } from '../useRoom';

const usePollWidgetState = () =>
{
    const { roomSession = null } = useRoom();

    const startPoll = (pollId: number) => roomSession.sendPollStartMessage(pollId);

    const rejectPoll = (pollId: number) => roomSession.sendPollRejectMessage(pollId);

    const answerPoll = (pollId: number, questionId: number, answers: string[]) => roomSession.sendPollAnswerMessage(pollId, questionId, answers);

    useNitroEvent<RoomSessionPollEvent>(RoomSessionPollEvent.OFFER, event =>
    {
        const pollEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.OFFER, event.id);

        pollEvent.summary = event.summary;
        pollEvent.headline = event.headline;

        DispatchUiEvent(pollEvent);
    });

    useNitroEvent<RoomSessionPollEvent>(RoomSessionPollEvent.ERROR, event =>
    {
        const pollEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.ERROR, event.id);

        pollEvent.summary = event.summary;
        pollEvent.headline = event.headline;

        DispatchUiEvent(pollEvent);
    });

    useNitroEvent<RoomSessionPollEvent>(RoomSessionPollEvent.CONTENT, event =>
    {
        const pollEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.CONTENT, event.id);

        pollEvent.startMessage = event.startMessage;
        pollEvent.endMessage = event.endMessage;
        pollEvent.numQuestions = event.numQuestions;
        pollEvent.questionArray = event.questionArray;
        pollEvent.npsPoll = event.npsPoll;

        DispatchUiEvent(pollEvent);
    });

    return { startPoll, rejectPoll, answerPoll };
};

export const usePollWidget = usePollWidgetState;
