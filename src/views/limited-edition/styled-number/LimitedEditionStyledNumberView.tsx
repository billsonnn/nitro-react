import { FC } from 'react';
import { LimitedEditionStyledNumberViewProps } from './LimitedEditionStyledNumberView.types';

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
