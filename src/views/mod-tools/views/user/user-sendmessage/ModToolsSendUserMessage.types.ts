import { MouseEvent } from 'react';
import { ISelectedUser } from '../../../utils/ISelectedUser';

export interface ModToolsSendUserMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: (event: MouseEvent) => void;
}
