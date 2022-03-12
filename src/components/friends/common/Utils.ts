export const getGroupChatData = (extraData: string) =>
{
    const splitData = extraData.split('/');

    const username = splitData[0];
    const figure = splitData[1];
    const userId = parseInt(splitData[2]);

    const result: IGroupChatData = { username: username, figure: figure, userId: userId }
    return  result;
}

export interface IGroupChatData
{
    username: string;
    figure: string;
    userId: number;
} 
