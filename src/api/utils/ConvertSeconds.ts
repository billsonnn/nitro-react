export const ConvertSeconds = (seconds: number) =>
{
    let numDays = Math.floor(seconds / 86400);
    let numHours = Math.floor((seconds % 86400) / 3600);
    let numMinutes = Math.floor(((seconds % 86400) % 3600) / 60);
    let numSeconds = ((seconds % 86400) % 3600) % 60;

    return numDays.toString().padStart(2, '0') + ':' + numHours.toString().padStart(2, '0') + ':' + numMinutes.toString().padStart(2, '0') + ':' + numSeconds.toString().padStart(2, '0');
}
