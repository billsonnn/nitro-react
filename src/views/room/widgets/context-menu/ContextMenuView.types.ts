export interface ContextMenuViewProps
{
    objectId: number;
    category: number;
    fades?: boolean;
    onClose: () => void;
}

export interface ContextMenuViewFadeOptions
{
    firstFadeStarted: boolean;
    fadeAfterDelay: boolean;
    fadeLength: number;
    fadeTime: number;
    fadeStartDelay: number;
    fadingOut: boolean;
}
