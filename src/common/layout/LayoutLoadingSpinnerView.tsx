import { FC } from 'react';
import { Base, BaseProps } from '../Base';

export const LayoutLoadingSpinnerView: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { ...rest } = props;

    return (
        <Base classNames={ [ 'spinner-container' ] } { ...rest } >
            <Base className="spinner" />
            <Base className="spinner" />
            <Base className="spinner" />
        </Base>
    );
};
