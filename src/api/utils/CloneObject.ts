export const CloneObject = <T>(object: T): T =>
{
    if((object == null) || ('object' != typeof object)) return object;

    // @ts-ignore
    const copy = new object.constructor();

    for(const attr in object)
    {
        if(object.hasOwnProperty(attr)) copy[attr] = object[attr];
    }

    return copy;
};
