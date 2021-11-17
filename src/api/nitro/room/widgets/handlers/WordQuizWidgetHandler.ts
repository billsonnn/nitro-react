import { AvatarAction, NitroEvent, RoomSessionWordQuizEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetHandler } from '.';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetWordQuizUpdateEvent } from '../events/RoomWidgetWordQuizUpdateEvent';
import { RoomWidgetMessage } from '../messages';

export class WordQuizWidgetHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        const roomQuizEvent = (event as RoomSessionWordQuizEvent);
        let widgetEvent: RoomWidgetWordQuizUpdateEvent;
        switch(event.type)
        {
            case RoomSessionWordQuizEvent.ANSWERED:
                const roomId = this.container.roomSession.roomId;
                const userData = this.container.roomSession.userDataManager.getUserData(roomQuizEvent.userId);
                if(!userData) return;
                widgetEvent = new RoomWidgetWordQuizUpdateEvent(RoomWidgetWordQuizUpdateEvent.QUESTION_ANSWERED, roomQuizEvent.id);
                widgetEvent.value = roomQuizEvent.value;
                widgetEvent.userId = roomQuizEvent.userId;
                widgetEvent.answerCounts = roomQuizEvent.answerCounts;

                if(widgetEvent.value === '0')
                {
                    GetRoomEngine().updateRoomObjectUserGesture(roomId, userData.roomIndex, AvatarAction.getGestureId(AvatarAction.GESTURE_SAD));
                }
                else
                {
                    GetRoomEngine().updateRoomObjectUserGesture(roomId, userData.roomIndex, AvatarAction.getGestureId(AvatarAction.GESTURE_SMILE));
                }
                break;
            case RoomSessionWordQuizEvent.FINISHED:
                widgetEvent = new RoomWidgetWordQuizUpdateEvent(RoomWidgetWordQuizUpdateEvent.QUESTION_FINISHED, roomQuizEvent.id);
                widgetEvent.pollId = roomQuizEvent.pollId;
                widgetEvent.questionId = roomQuizEvent.questionId;
                widgetEvent.answerCounts = roomQuizEvent.answerCounts;
                break;
            case RoomSessionWordQuizEvent.QUESTION:
                widgetEvent = new RoomWidgetWordQuizUpdateEvent(RoomWidgetWordQuizUpdateEvent.NEW_QUESTION, roomQuizEvent.id);
                widgetEvent.question = roomQuizEvent.question;
                widgetEvent.duration = roomQuizEvent.duration;
                widgetEvent.pollType = roomQuizEvent.pollType;
                widgetEvent.questionId = roomQuizEvent.questionId;
                widgetEvent.pollId = roomQuizEvent.pollId;
                break;
        }

        if(!widgetEvent) return;

        this.container.eventDispatcher.dispatchEvent(widgetEvent);
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.WORD_QUIZZ;
    }

    public get eventTypes(): string[]
    {
        return [RoomSessionWordQuizEvent.ANSWERED, RoomSessionWordQuizEvent.FINISHED, RoomSessionWordQuizEvent.QUESTION];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
