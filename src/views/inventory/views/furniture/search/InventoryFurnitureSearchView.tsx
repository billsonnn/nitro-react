import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { InventoryFurnitureSearchViewProps } from './InventoryFurnitureSearchView.types';

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
        <div className="d-flex">
            <div className="d-flex flex-grow-1 me-1">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            </div>
            <div className="d-flex">
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    );
}
