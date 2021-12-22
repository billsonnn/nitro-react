import { NitroEvent, RoomEngineUseProductEvent, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomSessionDanceEvent, RoomSessionUserDataUpdateEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetRoomSession, GetSessionDataManager, IsOwnerOfFurniture } from '../../../..';
import { FurniCategory } from '../../../../../views/inventory/common/FurniCategory';
import { RoomWidgetAvatarInfoEvent, RoomWidgetUpdateDanceStatusEvent, RoomWidgetUpdateEvent, RoomWidgetUpdateUserDataEvent, RoomWidgetUseProductBubbleEvent, UseProductItem } from '../events';
import { RoomWidgetAvatarExpressionMessage, RoomWidgetChangePostureMessage, RoomWidgetDanceMessage, RoomWidgetMessage, RoomWidgetRoomObjectMessage, RoomWidgetUseProductMessage, RoomWidgetUserActionMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetAvatarInfoHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateUserDataEvent());
                return;
            case RoomSessionDanceEvent.RSDE_DANCE:
                const danceEvent = (event as RoomSessionDanceEvent);

                let isDancing = false;

                const userData = GetRoomSession().userDataManager.getUserData(GetSessionDataManager().userId);

                if(userData && (userData.roomIndex === danceEvent.roomIndex)) isDancing = (danceEvent.danceId !== 0);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDanceStatusEvent(isDancing));
                return;
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY:
                return;
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
                this.processUsableRoomObject((event as RoomEngineUseProductEvent).objectId);
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        let userId = 0;

        if(message instanceof RoomWidgetUserActionMessage) userId = message.userId;

        switch(message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO:
                this.processOwnCharacterInfo();
                break;
            case RoomWidgetDanceMessage.DANCE: {
                const danceMessage = (message as RoomWidgetDanceMessage);

                GetRoomSession().sendDanceMessage(danceMessage.style);
                break;
            }
            case RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION: {
                const expressionMessage = (message as RoomWidgetAvatarExpressionMessage);

                GetRoomSession().sendExpressionMessage(expressionMessage.animation.ordinal)
                break;
            }
            case RoomWidgetChangePostureMessage.CHANGE_POSTURE: {
                const postureMessage = (message as RoomWidgetChangePostureMessage);

                GetRoomSession().sendPostureMessage(postureMessage.posture);
                break;
            }
            case RoomWidgetUseProductMessage.PET_PRODUCT: {
                const productMessage = (message as RoomWidgetUseProductMessage);

                GetRoomSession().usePetProduct(productMessage.objectId, productMessage.petId);
                break;
            }
        }

        return null;
    }

    private processOwnCharacterInfo(): void
    {
        const userId = GetSessionDataManager().userId;
        const userName = GetSessionDataManager().userName;
        const allowNameChange = GetSessionDataManager().canChangeName;
        const userData = GetRoomSession().userDataManager.getUserData(userId);

        if(userData) this.container.eventDispatcher.dispatchEvent(new RoomWidgetAvatarInfoEvent(userId, userName, userData.type, userData.roomIndex, allowNameChange));
    }

    private processUsableRoomObject(objectId: number): void
    {
        const roomId = this.container.roomSession.roomId;
        const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, RoomObjectCategory.FLOOR);

        if(!roomObject || !IsOwnerOfFurniture(roomObject)) return;

        const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
        const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);
        const furniData = GetSessionDataManager().getFloorItemData(typeId);
        const parts = furniData.customParams.split(' ');
        const part = (parts.length ? parseInt(parts[0]) : -1);

        if(part === -1) return;

        this.processUseableProduct(roomId, objectId, part, furniData.specialType, ownerId);
    }

    private processUseableProduct(roomId: number, objectId: number, part: number, specialType: number, ownerId: number, arg6 = -1): void
    {
        const useProductBubbles: UseProductItem[] = [];
        const roomObjects = GetRoomEngine().getRoomObjects(roomId, RoomObjectCategory.UNIT);

        for(const roomObject of roomObjects)
        {
            const userData = this.container.roomSession.userDataManager.getUserDataByIndex(roomObject.id);

            let replace = false;

            if(!userData || (userData.type !== RoomObjectType.PET))
            {

            }
            else
            {
                if(userData.ownerId === ownerId)
                {
                    if(userData.hasSaddle && (specialType === FurniCategory.PET_SADDLE)) replace = true;

                    const figureParts = userData.figure.split(' ');
                    const figurePart = (figureParts.length ? parseInt(figureParts[0]) : -1);

                    if(figurePart === part)
                    {
                        if(specialType === FurniCategory.MONSTERPLANT_REVIVAL)
                        {
                            if(!userData.canRevive) continue;
                        }

                        if(specialType === FurniCategory.MONSTERPLANT_REBREED)
                        {
                            if((userData.petLevel < 7) || userData.canRevive || userData.canBreed) continue;
                        }

                        if(specialType === FurniCategory.MONSTERPLANT_FERTILIZE)
                        {
                            if((userData.petLevel >= 7) || userData.canRevive) continue;
                        }

                        useProductBubbles.push(new UseProductItem(userData.roomIndex, RoomObjectCategory.UNIT, userData.name, objectId, roomObject.id, arg6, replace));
                    }
                }
            }
        }

        if(useProductBubbles.length) this.container.eventDispatcher.dispatchEvent(new RoomWidgetUseProductBubbleEvent(RoomWidgetUseProductBubbleEvent.USE_PRODUCT_BUBBLES, useProductBubbles));
    }

    public get type(): string
    {
        return RoomWidgetEnum.AVATAR_INFO;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionUserDataUpdateEvent.USER_DATA_UPDATED,
            RoomSessionDanceEvent.RSDE_DANCE,
            RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY,
            RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO,
            RoomWidgetDanceMessage.DANCE,
            RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION,
            RoomWidgetChangePostureMessage.CHANGE_POSTURE,
            RoomWidgetUseProductMessage.PET_PRODUCT
        ];
    }
}
