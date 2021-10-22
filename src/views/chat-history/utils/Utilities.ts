export const currentDate = () =>
{
    const currentTime = new Date();
    return `${currentTime.getHours()}:${currentTime.getMinutes()}`;
}
