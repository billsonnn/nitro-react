import { MouseEvent } from 'react';
import { ISelectedUser } from '../../../utils/ISelectedUser';

export interface ModToolsUserModActionViewProps
{
    user: ISelectedUser;
    onCloseClick: (event: MouseEvent) => void;
}
