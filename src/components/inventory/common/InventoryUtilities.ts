let objectMoverRequested = false;
let itemIdInPlacing = -1;

export function isObjectMoverRequested(): boolean
{
    return objectMoverRequested;
}

export function setObjectMoverRequested(flag: boolean)
{
    objectMoverRequested = flag;
}

export function getPlacingItemId(): number
{
    return itemIdInPlacing;
}

export function setPlacingItemId(id: number)
{
    itemIdInPlacing = id;
}
