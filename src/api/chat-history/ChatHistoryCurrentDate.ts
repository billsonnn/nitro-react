export const ChatHistoryCurrentDate = () =>
{
    const currentTime = new Date();

    return `${ currentTime.getHours().toString().padStart(2, '0') }:${ currentTime.getMinutes().toString().padStart(2, '0') }`;
};
