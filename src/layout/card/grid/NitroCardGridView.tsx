import { FC } from 'react';
import { NitroCardGridViewProps } from './NitroCardGridView.types';

export const NitroCardGridView: FC<NitroCardGridViewProps> = props =>
{
    const { columns = 5, children = null } = props;

    return (
        <div className="h-100 overflow-hidden nitro-card-grid">
            <div className={ `row row-cols-${ columns } align-content-start g-0 w-100 h-100 overflow-auto` }>
                { children }
            </div>
        </div>
    );
}
