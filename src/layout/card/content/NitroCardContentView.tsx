import classNames from 'classnames';
import { FC } from 'react';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    const { isDark = false } = props;

    return (
        <div className={ 'container-fluid bg-light content-area ' + classNames({ 'bg-light': !isDark, 'bg-dark': isDark }) }>
            { props.children }
        </div>
    );
}
