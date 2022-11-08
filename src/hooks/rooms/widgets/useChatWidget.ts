import { AvatarFigurePartType, AvatarScaleType, AvatarSetType, GetGuestRoomResultEvent, NitroPoint, PetFigureData, RoomChatSettings, RoomChatSettingsEvent, RoomDragEvent, RoomObjectCategory, RoomObjectType, RoomObjectVariable, RoomSessionChatEvent, RoomUserData, SystemChatStyleEnum, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatBubbleMessage, ChatEntryType, ChatHistoryCurrentDate, GetAvatarRenderManager, GetConfiguration, GetRoomEngine, GetRoomObjectScreenLocation, IRoomChatSettings, LocalizeText, PlaySound, RoomChatFormatter } from '../../../api';
import { useMessageEvent, useRoomEngineEvent, useRoomSessionManagerEvent } from '../../events';
import { useRoom } from '../useRoom';
import { useChatHistory } from './../../chat-history/useChatHistory';

const avatarColorCache: Map<string, number> = new Map();
const avatarImageCache: Map<string, string> = new Map();
const petImageCache: Map<string, string> = new Map();

const useChatWidgetState = () =>
{
    const [ chatMessages, setChatMessages ] = useState<ChatBubbleMessage[]>([]);
    const [ chatSettings, setChatSettings ] = useState<IRoomChatSettings>({
        mode: RoomChatSettings.CHAT_MODE_FREE_FLOW,
        weight: RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL,
        speed: RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL,
        distance: 50,
        protection: RoomChatSettings.FLOOD_FILTER_NORMAL
    });
    const { roomSession = null } = useRoom();
    const { addChatEntry } = useChatHistory();
    const isDisposed = useRef(false);

    const getScrollSpeed = useMemo(() =>
    {
        if(!chatSettings) return 6000;

        switch(chatSettings.speed)
        {
            case RoomChatSettings.CHAT_SCROLL_SPEED_FAST:
                return 3000;
            case RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL:
                return 6000;
            case RoomChatSettings.CHAT_SCROLL_SPEED_SLOW:
                return 12000;
        }
    }, [ chatSettings ]);

    const setFigureImage = (figure: string) =>
    {
        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, null, {
            resetFigure: figure => 
            {
                if(isDisposed.current) return;

                setFigureImage(figure);
            },
            dispose: () => 
            {},
            disposed: false
        });

        if(!avatarImage) return;

        const image = avatarImage.getCroppedImage(AvatarSetType.HEAD);
        const color = avatarImage.getPartColor(AvatarFigurePartType.CHEST);

        avatarColorCache.set(figure, ((color && color.rgb) || 16777215));

        avatarImage.dispose();

        avatarImageCache.set(figure, image.src);

        return image.src;
    }

    const getUserImage = (figure: string) =>
    {
        let existing = avatarImageCache.get(figure);

        if(!existing) existing = setFigureImage(figure);

        return existing;
    }

    const getPetImage = (figure: string, direction: number, _arg_3: boolean, scale: number = 64, posture: string = null) =>
    {
        let existing = petImageCache.get((figure + posture));

        if(existing) return existing;

        const figureData = new PetFigureData(figure);
        const typeId = figureData.typeId;
        const image = GetRoomEngine().getRoomObjectPetImage(typeId, figureData.paletteId, figureData.color, new Vector3d((direction * 45)), scale, null, false, 0, figureData.customParts, posture);

        if(image)
        {
            existing = TextureUtils.generateImageUrl(image.data);

            petImageCache.set((figure + posture), existing);
        }

        return existing;
    }

    const removeHiddenChats = () =>
    {
        setChatMessages(prevValue =>
        {
            if(prevValue)
            {
                const newMessages = prevValue.filter(chat => ((chat.top > (-(chat.height) * 2))));

                if(newMessages.length !== prevValue.length) return newMessages;
            }

            return prevValue;
        })
    }

    const moveAllChatsUp = (amount: number) =>
    {
        setChatMessages(prevValue =>
        {
            if(prevValue)
            {
                prevValue.forEach(chat =>
                {
                    if(chat.skipMovement)
                    {
                        chat.skipMovement = false;
            
                        return;
                    }
            
                    chat.top -= amount;
                });
            }

            return prevValue;
        });

        removeHiddenChats();
    }

    useRoomSessionManagerEvent<RoomSessionChatEvent>(RoomSessionChatEvent.CHAT_EVENT, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, RoomObjectCategory.UNIT);
        const bubbleLocation = roomObject ? GetRoomObjectScreenLocation(roomSession.roomId, roomObject?.id, RoomObjectCategory.UNIT) : new NitroPoint();
        const userData = roomObject ? roomSession.userDataManager.getUserDataByIndex(event.objectId) : new RoomUserData(-1);

        let username = '';
        let avatarColor = 0;
        let imageUrl: string = null;
        let chatType = event.chatType;
        let styleId = event.style;
        let userType = 0;
        let petType = -1;
        let text = event.message;

        if(userData)
        {
            userType = userData.type;

            const figure = userData.figure;

            switch(userType)
            {
                case RoomObjectType.PET:
                    imageUrl = getPetImage(figure, 2, true, 64, roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE));
                    petType = new PetFigureData(figure).typeId;
                    break;
                case RoomObjectType.USER:
                    imageUrl = getUserImage(figure);
                    break;
                case RoomObjectType.RENTABLE_BOT:
                case RoomObjectType.BOT:
                    styleId = SystemChatStyleEnum.BOT;
                    break;
            }

            avatarColor = avatarColorCache.get(figure);
            username = userData.name;
        }

        switch(chatType)
        {
            case RoomSessionChatEvent.CHAT_TYPE_RESPECT:
                text = LocalizeText('widgets.chatbubble.respect', [ 'username' ], [ username ]);

                if(GetConfiguration('respect.options')['enabled']) PlaySound(GetConfiguration('respect.options')['sound']);

                break;
            case RoomSessionChatEvent.CHAT_TYPE_PETREVIVE:
            case RoomSessionChatEvent.CHAT_TYPE_PET_REBREED_FERTILIZE:
            case RoomSessionChatEvent.CHAT_TYPE_PET_SPEED_FERTILIZE: {
                let textKey = 'widget.chatbubble.petrevived';

                if(chatType === RoomSessionChatEvent.CHAT_TYPE_PET_REBREED_FERTILIZE)
                {
                    textKey = 'widget.chatbubble.petrefertilized;';
                }

                else if(chatType === RoomSessionChatEvent.CHAT_TYPE_PET_SPEED_FERTILIZE)
                {
                    textKey = 'widget.chatbubble.petspeedfertilized';
                }

                let targetUserName: string = null;

                const newRoomObject = GetRoomEngine().getRoomObject(roomSession.roomId, event.extraParam, RoomObjectCategory.UNIT);

                if(newRoomObject)
                {
                    const newUserData = roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                    if(newUserData) targetUserName = newUserData.name;
                }

                text = LocalizeText(textKey, [ 'petName', 'userName' ], [ username, targetUserName ]);
                break;
            }
            case RoomSessionChatEvent.CHAT_TYPE_PETRESPECT:
                text = LocalizeText('widget.chatbubble.petrespect', [ 'petname' ], [ username ]);
                break;
            case RoomSessionChatEvent.CHAT_TYPE_PETTREAT:
                text = LocalizeText('widget.chatbubble.pettreat', [ 'petname' ], [ username ]);
                break;
            case RoomSessionChatEvent.CHAT_TYPE_HAND_ITEM_RECEIVED:
                text = LocalizeText('widget.chatbubble.handitem', [ 'username', 'handitem' ], [ username, LocalizeText(('handitem' + event.extraParam)) ]);
                break;
            case RoomSessionChatEvent.CHAT_TYPE_MUTE_REMAINING: {
                const hours = ((event.extraParam > 0) ? Math.floor((event.extraParam / 3600)) : 0).toString();
                const minutes = ((event.extraParam > 0) ? Math.floor((event.extraParam % 3600) / 60) : 0).toString();
                const seconds = (event.extraParam % 60).toString();

                text = LocalizeText('widget.chatbubble.mutetime', [ 'hours', 'minutes', 'seconds' ], [ hours, minutes, seconds ]);
                break;
            }
        }

        const formattedText = RoomChatFormatter(text);
        const color = (avatarColor && (('#' + (avatarColor.toString(16).padStart(6, '0'))) || null));

        const chatMessage = new ChatBubbleMessage(
            userData.roomIndex,
            RoomObjectCategory.UNIT,
            roomSession.roomId,
            text,
            formattedText,
            username,
            new NitroPoint(bubbleLocation.x, bubbleLocation.y),
            chatType,
            styleId,
            imageUrl,
            color);

        setChatMessages(prevValue => [ ...prevValue, chatMessage ]);
        addChatEntry({ id: -1, entityId: userData.roomIndex, name: username, imageUrl, style: styleId, chatType: chatType, entityType: userData.type, message: formattedText, timestamp: ChatHistoryCurrentDate(), type: ChatEntryType.TYPE_CHAT, roomId: roomSession.roomId, color });
    });

    useRoomEngineEvent<RoomDragEvent>(RoomDragEvent.ROOM_DRAG, event =>
    {
        if(!chatMessages.length || (event.roomId !== roomSession.roomId)) return;

        const offsetX = event.offsetX;

        chatMessages.forEach(chat => (chat.elementRef && (chat.left += offsetX)));
    });

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter) return;
        
        setChatSettings(parser.chat);
    });

    useMessageEvent<RoomChatSettingsEvent>(RoomChatSettingsEvent, event =>
    {
        const parser = event.getParser();
        
        setChatSettings(parser.chat);
    });

    useEffect(() =>
    {
        isDisposed.current = false;

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);

    return { chatMessages, setChatMessages, chatSettings, getScrollSpeed, removeHiddenChats, moveAllChatsUp };
}

export const useChatWidget = useChatWidgetState;
