import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { InventoryFurnitureSearchViewProps } from './InventoryFurnitureSearchView.types';

export const InventoryFurnitureSearchView: FC<InventoryFurnitureSearchViewProps> = props =>
{
    const [ searchValue, setSearchValue ] = useState('');

    function onChange(event: ChangeEvent<HTMLInputElement>): void
    {
        setSearchValue(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>): void
    {
        event.preventDefault();
    }

    useEffect(() =>
    {
        
    }, [ searchValue ]);

    return (
        <form className="d-flex mb-1" onSubmit={ handleSubmit }>
            <div className="d-flex flex-grow-1 me-1">
                <input type="text" className="form-control form-control-sm" placeholder="search" />
            </div>
            <div className="d-flex">
                <button type="submit" className="btn btn-primary btn-sm"><i className="fas fa-search"></i></button>
            </div>
        </form>
    );
}
