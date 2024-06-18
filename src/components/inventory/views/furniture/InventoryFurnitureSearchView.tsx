import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { GroupItem, LocalizeText } from '../../../../api';
import { NitroButton, NitroInput } from '../../../../layout';

export const InventoryFurnitureSearchView: FC<{
    groupItems: GroupItem[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
}> = props =>
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
        <div className="flex gap-1">
            <NitroInput
                placeholder={ LocalizeText('generic.search') }
                value={ searchValue }
                onChange={ event => setSearchValue(event.target.value) } />
            <NitroButton>
                <FaSearch className="fa-icon" />
            </NitroButton>
        </div>
    );
};
