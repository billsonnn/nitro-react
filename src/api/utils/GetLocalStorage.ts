export const GetLocalStorage = <T>(key: string) =>
{
    try
    {
        JSON.parse(window.localStorage.getItem(key)) as T ?? null
    }
    catch(e)
    {
        return null;
    }
}
