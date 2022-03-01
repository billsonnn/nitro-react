import { FC } from 'react';

interface ItemCountViewProps
{
    count: number;
}

export const ItemCountView: FC<ItemCountViewProps> = props =>
{
    const { count = 0 } = props;

    return <div className="position-absolute badge border bg-danger px-1 rounded-circle nitro-item-count">{ count }</div>
}
