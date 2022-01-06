import { FC } from 'react';

export interface LimitedEditionStyledNumberViewProps
{
    value: number;
}

export const LimitedEditionStyledNumberView: FC<LimitedEditionStyledNumberViewProps> = props =>
{
    const { value = 0 } = props;

    const numbers = value.toString().split('');
    
    return (
        <>
            { numbers.map((number, index) =>
                {
                    return <i key={ index } className={ 'limited-edition-number n-' + number } />;
                })}
        </>
    );
}
