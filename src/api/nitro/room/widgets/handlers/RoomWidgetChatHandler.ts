import { AvatarFigurePartType, AvatarScaleType, AvatarSetType, IAvatarImageListener, INitroPoint, IVector3D, NitroEvent, NitroPoint, PetFigureData, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomSessionChatEvent, RoomWidgetEnum, SystemChatStyleEnum, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { GetAvatarRenderManager, GetConfigurationManager, GetRoomEngine, PlaySound } from '../../../..';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomWidgetUpdateChatEvent, RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class RoomWidgetChatHandler extends RoomWidgetHandler implements IAvatarImageListener
{
    private _avatarColorCache: Map<string, number> = new Map();
    private _avatarImageCache: Map<string, string> = new Map();
    private _petImageCache: Map<string, string> = new Map();

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionChatEvent.CHAT_EVENT: {
                const chatEvent = (event as RoomSessionChatEvent);

                const roomObject = GetRoomEngine().getRoomObject(chatEvent.session.roomId, chatEvent.objectId, RoomObjectCategory.UNIT);

                if(!roomObject) return;

                const objectLocation = roomObject.getLocation();
                const bubbleLocation = this.getBubbleLocation(chatEvent.session.roomId, objectLocation);
                const userData = this.container.roomSession.userDataManager.getUserDataByIndex(chatEvent.objectId);

                let username = '';
                let avatarColor = 0;
                let imageUrl: string = null;
                let chatType = chatEvent.chatType;
                let styleId = chatEvent.style;
                let userType = 0;
                let petType = -1;
                let text = chatEvent.message;

                if(userData)
                {
                    userType = userData.type;

                    const figure = userData.figure;

                    switch(userType)
                    {
                        case RoomObjectType.PET:
                            imageUrl = this.getPetImage(figure, 2, true, 64, roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE));
                            petType = new PetFigureData(figure).typeId;
                            break;
                        case RoomObjectType.USER:
                            imageUrl = this.getUserImage(figure);
                            break;
                        case RoomObjectType.RENTABLE_BOT:
                        case RoomObjectType.BOT:
                            styleId = SystemChatStyleEnum.BOT;
                            break;
                    }

                    avatarColor = this._avatarColorCache.get(figure);
                    username = userData.name;
                }

                switch(chatType)
                {
                    case RoomSessionChatEvent.CHAT_TYPE_RESPECT:
                        text = LocalizeText('widgets.chatbubble.respect', [ 'username' ], [ username ]);
                        if(GetConfigurationManager().getValue('respect.options')['enabled'])
                            PlaySound(GetConfigurationManager().getValue('respect.options')['sound'])
                        break;
                    case RoomSessionChatEvent.CHAT_TYPE_PETRESPECT:
                        text = LocalizeText('widget.chatbubble.petrespect', [ 'petname' ], [ username ]);
                        break;
                    case RoomSessionChatEvent.CHAT_TYPE_PETTREAT:
                        text = LocalizeText('widget.chatbubble.pettreat', [ 'petname' ], [ username ]);
                        break;
                    case RoomSessionChatEvent.CHAT_TYPE_HAND_ITEM_RECEIVED:
                        text = LocalizeText('widget.chatbubble.handitem', [ 'username', 'handitem' ], [ username, LocalizeText(('handitem' + chatEvent.extraParam))]);
                        break;
                    case RoomSessionChatEvent.CHAT_TYPE_MUTE_REMAINING: {
                        const hours = ((chatEvent.extraParam > 0) ? Math.floor((chatEvent.extraParam / 3600)) : 0).toString();
                        const minutes = ((chatEvent.extraParam > 0) ? Math.floor((chatEvent.extraParam % 3600) / 60) : 0).toString();
                        const seconds = (chatEvent.extraParam % 60).toString();

                        text = LocalizeText('widget.chatbubble.mutetime', [ 'hours', 'minutes', 'seconds' ], [ hours, minutes, seconds ]);
                        break;
                    }
                }

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateChatEvent(RoomWidgetUpdateChatEvent.CHAT_EVENT, userData.roomIndex, text, username, RoomObjectCategory.UNIT, userType, petType, bubbleLocation.x, bubbleLocation.y, imageUrl, avatarColor, chatEvent.session.roomId, chatType, styleId, []));

                return;
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    private getBubbleLocation(roomId: number, userLocation: IVector3D, canvasId = 1): INitroPoint
    {
        const geometry = GetRoomEngine().getRoomInstanceGeometry(roomId, canvasId);
        const scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomId, canvasId);

        let x = ((document.body.offsetWidth * scale) / 2);
        let y = ((document.body.offsetHeight * scale) / 2);

        if(geometry && userLocation)
        {
            const screenPoint = geometry.getScreenPoint(userLocation);

            if(screenPoint)
            {
                x = (x + (screenPoint.x * scale));
                y = (y + (screenPoint.y * scale));

                const offsetPoint = GetRoomEngine().getRoomInstanceRenderingCanvasOffset(roomId, canvasId);

                if(offsetPoint)
                {
                    x = (x + offsetPoint.x);
                    y = (y + offsetPoint.y);
                }
            }
        }

        return new NitroPoint(x, y);
    }

    public getUserImage(figure: string): string
    {
        let existing = this._avatarImageCache.get(figure);

        if(!existing)
        {
            existing = this.setFigureImage(figure);
        }

        return existing;
    }

    private setFigureImage(figure: string): string
    {
        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, null, this);

        if(!avatarImage) return;

        const image = avatarImage.getCroppedImage(AvatarSetType.HEAD);
        const color = avatarImage.getPartColor(AvatarFigurePartType.CHEST);

        this._avatarColorCache.set(figure, ((color && color.rgb) || 16777215));

        avatarImage.dispose();

        this._avatarImageCache.set(figure, image.src);

        return image.src;
    }

    private getPetImage(figure: string, direction: number, _arg_3: boolean, scale: number = 64, posture: string = null): string
    {
        let existing = this._petImageCache.get((figure + posture));

        if(existing) return existing;

        const figureData = new PetFigureData(figure);
        const typeId = figureData.typeId;
        const image = GetRoomEngine().getRoomObjectPetImage(typeId, figureData.paletteId, figureData.color, new Vector3d((direction * 45)), scale, null, false, 0, figureData.customParts, posture);

        if(image)
        {
            existing = TextureUtils.generateImageUrl(image.data);

            this._petImageCache.set((figure + posture), existing);
        }

        return existing;
    }

    public resetFigure(figure: string): void
    {
        this.setFigureImage(figure);
    }

    public dispose(): void
    {

    }

    public get disposed(): boolean
    {
        return false;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionChatEvent.CHAT_EVENT
        ];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
