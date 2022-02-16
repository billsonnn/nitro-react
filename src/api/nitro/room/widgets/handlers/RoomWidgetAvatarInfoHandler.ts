import { NitroEvent, RoomEngineUseProductEvent, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomSessionDanceEvent, RoomSessionPetStatusUpdateEvent, RoomSessionUserDataUpdateEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture } from '../../../..';
import { FurniCategory } from '../../../../../components/inventory/common/FurniCategory';
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

                const userData = this.container.roomSession.userDataManager.getUserData(GetSessionDataManager().userId);

                if(userData && (userData.roomIndex === danceEvent.roomIndex)) isDancing = (danceEvent.danceId !== 0);

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateDanceStatusEvent(isDancing));
                return;
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_INVENTORY:
                return;
            case RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM:
                this.processUsableRoomObject((event as RoomEngineUseProductEvent).objectId);
                return;
            case RoomSessionPetStatusUpdateEvent.PET_STATUS_UPDATE:
                this.processRoomSessionPetStatusUpdateEvent((event as RoomSessionPetStatusUpdateEvent));
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
            case RoomWidgetUserActionMessage.START_NAME_CHANGE:
                // habbo help - start name change
                break;
            case RoomWidgetUserActionMessage.REQUEST_PET_UPDATE:
                break;
            case RoomWidgetUseProductMessage.PET_PRODUCT: {
                const productMessage = (message as RoomWidgetUseProductMessage);

                this.container.roomSession.usePetProduct(productMessage.objectId, productMessage.petId);
                break;
            }
            case RoomWidgetUserActionMessage.HARVEST_PET:
                this.container.roomSession.harvestPet(userId);
                break;
            case RoomWidgetUserActionMessage.COMPOST_PLANT:
                this.container.roomSession.compostPlant(userId);
                break;
            case RoomWidgetDanceMessage.DANCE: {
                const danceMessage = (message as RoomWidgetDanceMessage);

                this.container.roomSession.sendDanceMessage(danceMessage.style);
                break;
            }
            case RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION: {
                const expressionMessage = (message as RoomWidgetAvatarExpressionMessage);

                this.container.roomSession.sendExpressionMessage(expressionMessage.animation.ordinal)
                break;
            }
            case RoomWidgetChangePostureMessage.CHANGE_POSTURE: {
                const postureMessage = (message as RoomWidgetChangePostureMessage);

                this.container.roomSession.sendPostureMessage(postureMessage.posture);
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
        const userData = this.container.roomSession.userDataManager.getUserData(userId);

        if(!userData) return;
        
        this.container.eventDispatcher.dispatchEvent(new RoomWidgetAvatarInfoEvent(userId, userName, userData.type, userData.roomIndex, allowNameChange));
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

    private processRoomSessionPetStatusUpdateEvent(event: RoomSessionPetStatusUpdateEvent): void
    {
        
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
            RoomEngineUseProductEvent.USE_PRODUCT_FROM_ROOM,
            RoomSessionPetStatusUpdateEvent.PET_STATUS_UPDATE
        ];
    }

    // UserNameUpdateEvent.UNUE_NAME_UPDATED
    // RoomSessionNestBreedingSuccessEvent.RSPFUE_NEST_BREEDING_SUCCESS
    // RoomSessionPetLevelUpdateEvent.RSPLUE_PET_LEVEL_UPDATE

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO,
            RoomWidgetUserActionMessage.START_NAME_CHANGE,
            RoomWidgetUserActionMessage.REQUEST_PET_UPDATE,
            RoomWidgetUseProductMessage.PET_PRODUCT,
            RoomWidgetUserActionMessage.REQUEST_BREED_PET,
            RoomWidgetUserActionMessage.HARVEST_PET,
            RoomWidgetUserActionMessage.REVIVE_PET,
            RoomWidgetUserActionMessage.COMPOST_PLANT,
            RoomWidgetDanceMessage.DANCE,
            RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION,
            RoomWidgetChangePostureMessage.CHANGE_POSTURE,
        ];
    }
}
