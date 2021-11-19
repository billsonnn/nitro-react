import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { useRoomContext } from '../../context/RoomContext';
import { ObjectLocationView } from '../object-location/ObjectLocationView';
import { UserLocationViewProps } from './UserLocationView.types';

export const UserLocationView: FC<UserLocationViewProps> = props =>
{
    const { userId = -1, ...rest } = props;
    const { roomSession = null } = useRoomContext();

    if((userId === -1) || !roomSession) return null;

    const userData = roomSession.userDataManager.getUserData(userId);

    if(!userData) return null;

    return <ObjectLocationView objectId={ userData.roomIndex } category={ RoomObjectCategory.UNIT } { ...rest } />;
}
