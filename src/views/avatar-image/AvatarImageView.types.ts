export interface AvatarImageViewProps
{
    figure: string;
    gender?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}

export interface AvatarImageViewState
{
    avatarUrl: string;
}
