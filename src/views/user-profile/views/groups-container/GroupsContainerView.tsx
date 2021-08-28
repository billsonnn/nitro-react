import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { GroupInformationView } from '../../../groups/views/GroupInformationView';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { GroupsContainerViewProps } from './GroupsContainerView.types';

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { groups = null } = props;

    const [ selectedIndex, setSelectedIndex ] = useState<number>(null);

    useEffect(() =>
    {
        if(groups.length > 0 && selectedIndex === null) setSelectedIndex(0);
    }, [ groups ]);

    if(!groups) return null;
    
    return (
        <div className="d-flex">
            <div className="profile-groups p-2">
                <div className="h-100 overflow-auto d-flex flex-column gap-1">
                    { groups.map((group, index) =>
                        {
                            return <div key={ index } onClick={ () => setSelectedIndex(index) } className={ 'profile-groups-item flex-shrink-0 d-flex align-items-center justify-content-center cursor-pointer' + classNames({ ' active': selectedIndex === index }) }>
                                <BadgeImageView badgeCode={ group.badge } isGroup={ true } />
                            </div>
                        }) }
                </div>
            </div>
            <div className="w-100">
                { selectedIndex > -1 && <GroupInformationView group={ groups[selectedIndex] } /> }
            </div>
        </div>
    );
}
