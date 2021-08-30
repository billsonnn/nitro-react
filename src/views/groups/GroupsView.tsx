import { FC } from 'react';
import { GroupInformationBoxView } from './views/information-standalone/GroupInformationStandaloneView';

export const GroupsView: FC<{}> = props =>
{
    return (
        <>
            <GroupInformationBoxView />
        </>
    );
};
