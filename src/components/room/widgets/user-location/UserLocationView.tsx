import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { BaseProps } from '../../../../common';
import { useRoom } from '../../../../hooks';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

interface UserLocationViewProps extends BaseProps<HTMLDivElement>
{
    userId: number;
}

export const UserLocationView: FC<UserLocationViewProps> = props =>
{
    const { userId = -1, ...rest } = props;
    const { roomSession = null } = useRoom();

    if((userId === -1) || !roomSession) return null;

    const userData = roomSession.userDataManager.getUserData(userId);

    if(!userData) return null;

    return <ObjectLocationView objectId={ userData.roomIndex } category={ RoomObjectCategory.UNIT } { ...rest } />;
}
