import { IGroupChatData } from './IGroupChatData';

export const GetGroupChatData = (extraData: string) =>
{
    if(!extraData || !extraData.length) return null;
    
    const splitData = extraData.split('/');
    const username = splitData[0];
    const figure = splitData[1];
    const userId = parseInt(splitData[2]);

    return ({ username: username, figure: figure, userId: userId } as IGroupChatData);
}
