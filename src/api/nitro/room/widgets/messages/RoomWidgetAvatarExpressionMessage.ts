import { AvatarExpressionEnum } from '@nitrots/nitro-renderer';
import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetAvatarExpressionMessage extends RoomWidgetMessage
{
    public static AVATAR_EXPRESSION: string = 'RWAEM_MESSAGE_AVATAR_EXPRESSION';

    private _animation: AvatarExpressionEnum;

    constructor(animation: AvatarExpressionEnum)
    {
        super(RoomWidgetAvatarExpressionMessage.AVATAR_EXPRESSION);

        this._animation = animation;
    }

    public get animation(): AvatarExpressionEnum
    {
        return this._animation;
    }
}
