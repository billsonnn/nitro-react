import { IRoomChatSettings } from './IRoomChatSettings';
import { IRoomModerationSettings } from './IRoomModerationSettings';

export interface IRoomData
{
    roomId: number;
    roomName: string;
    roomDescription: string;
    categoryId: number;
    userCount: number;
    tags: string[];
    tradeState: number;
    allowWalkthrough: boolean;
    lockState: number;
    password: string;
    allowPets: boolean;
    allowPetsEat: boolean;
    hideWalls: boolean;
    wallThickness: number;
    floorThickness: number;
    chatSettings: IRoomChatSettings;
    moderationSettings: IRoomModerationSettings;
}
