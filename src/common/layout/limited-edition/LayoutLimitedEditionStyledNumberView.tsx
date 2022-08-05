import { FC } from 'react';

interface LayoutLimitedEditionStyledNumberViewProps
{
    value: number;
}

export const LayoutLimitedEditionStyledNumberView: FC<LayoutLimitedEditionStyledNumberViewProps> = props =>
{
    const { value = 0 } = props;
    const numbers = value.toString().split('');
    
    return (
        <>
            { numbers.map((number, index) => <i key={ index } className={ 'limited-edition-number n-' + number } />) }
        </>
    );
}
