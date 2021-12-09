import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Flex } from '../../../../common/Flex';
import { GroupItem } from '../../common/GroupItem';

export interface InventoryFurnitureSearchViewProps
{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}

export const InventoryFurnitureSearchView: FC<InventoryFurnitureSearchViewProps> = props =>
{
    const { groupItems = [], setGroupItems = null } = props;
    const [ searchValue, setSearchValue ] = useState('');

    useEffect(() =>
    {
        let filteredGroupItems = [ ...groupItems ];

        if(searchValue && searchValue.length)
        {
            const comparison = searchValue.toLocaleLowerCase();

            filteredGroupItems = groupItems.filter(item =>
                {
                    if(comparison && comparison.length)
                    {
                        if(item.name.toLocaleLowerCase().includes(comparison)) return item;
                    }

                    return null;
                });
        }

        setGroupItems(filteredGroupItems);
    }, [ groupItems, setGroupItems, searchValue ]);

    return (
        <Flex gap={ 1 }>
            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            <Button variant="primary" size="sm">
                <FontAwesomeIcon icon="search" />
            </Button>
        </Flex>
    );
}
