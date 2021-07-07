import { FC } from 'react';
import { LimitedEditionStyledNumberView } from '../../../../views/shared/limited-edition/styled-number/LimitedEditionStyledNumberView';
import { NitroCardGridItemViewProps } from './NitroCardGridItemView.types';

export const NitroCardGridItemView: FC<NitroCardGridItemViewProps> = props =>
{
    const { itemActive = false, itemCount = 1, itemUnique = false, itemUniqueNumber = 0, itemImage = null, className = '', style = {}, children = null, ...rest } = props;

    const imageUrl = `url(${ itemImage })`;

    return (
        <div className="col pb-1 grid-item-container">
            <div className={ `position-relative border border-2 rounded grid-item cursor-pointer${ itemActive ? ' active' : '' }${ itemUnique ? ' unique-item' : '' } ${ className || '' }` } style={ itemImage ? { ...style, backgroundImage: imageUrl } : style } { ...rest }>
                { (itemCount > 1) &&
                    <span className="position-absolute badge border bg-danger px-1 rounded-circle">{ itemCount }</span> }
                { itemUnique && 
                    <div className="position-absolute unique-item-counter">
                        <LimitedEditionStyledNumberView value={ itemUniqueNumber } />
                    </div> }
                { children }
            </div>
        </div>
    );
}
