import { NitroEvent, RoomSessionPollEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetPollUpdateEvent } from '../events/RoomWidgetPollUpdateEvent';
import { RoomWidgetUpdateEvent } from '../events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetPollMessage } from '../messages/RoomWidgetPollMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class PollWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        const pollEvent = (event as RoomSessionPollEvent);

        let widgetEvent: RoomWidgetPollUpdateEvent;

        switch(event.type)
        {
            case RoomSessionPollEvent.OFFER:
                widgetEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.OFFER, pollEvent.id);
                widgetEvent.summary = pollEvent.summary;
                widgetEvent.headline = pollEvent.headline;
                break;
            case RoomSessionPollEvent.ERROR:
                widgetEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.ERROR, pollEvent.id);
                widgetEvent.summary = pollEvent.summary;
                widgetEvent.headline = pollEvent.headline;
                break;
            case RoomSessionPollEvent.CONTENT:
                widgetEvent = new RoomWidgetPollUpdateEvent(RoomWidgetPollUpdateEvent.CONTENT, pollEvent.id);
                widgetEvent.startMessage = pollEvent.startMessage;
                widgetEvent.endMessage = pollEvent.endMessage;
                widgetEvent.numQuestions = pollEvent.numQuestions;
                widgetEvent.questionArray = pollEvent.questionArray;
                widgetEvent.npsPoll = pollEvent.npsPoll;
                break;
        }

        if(!widgetEvent) return;

        this.container.eventDispatcher.dispatchEvent(widgetEvent);
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        const pollMessage = (message as RoomWidgetPollMessage);
        switch(message.type)
        {
            case RoomWidgetPollMessage.START:
                this.container.roomSession.sendPollStartMessage(pollMessage.id);
                break;
            case RoomWidgetPollMessage.REJECT:
                this.container.roomSession.sendPollRejectMessage(pollMessage.id);
                break;
            case RoomWidgetPollMessage.ANSWER:
                this.container.roomSession.sendPollAnswerMessage(pollMessage.id, pollMessage.questionId, pollMessage.answers);
                break;
        }
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_POLL;
    }

    public get eventTypes(): string[]
    {
        return [RoomSessionPollEvent.OFFER, RoomSessionPollEvent.ERROR, RoomSessionPollEvent.CONTENT];
    }

    public get messageTypes(): string[]
    {
        return [RoomWidgetPollMessage.ANSWER, RoomWidgetPollMessage.REJECT, RoomWidgetPollMessage.START];
    }
}
