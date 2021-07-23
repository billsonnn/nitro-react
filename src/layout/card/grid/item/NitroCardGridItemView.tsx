import { FC } from 'react';
import { LimitedEditionStyledNumberView } from '../../../../views/shared/limited-edition/styled-number/LimitedEditionStyledNumberView';
import { useNitroCardGridContext } from '../context';
import { NitroCardGridThemes } from '../NitroCardGridView.types';
import { NitroCardGridItemViewProps } from './NitroCardGridItemView.types';

export const NitroCardGridItemView: FC<NitroCardGridItemViewProps> = props =>
{
    const { itemImage = undefined, itemColor = undefined, itemActive = false, itemCount = 1, itemUnique = false, itemUniqueNumber = 0, itemUnseen = false, columns = undefined, className = '', style = {}, children = null, ...rest } = props;
    const { theme = NitroCardGridThemes.THEME_DEFAULT } = useNitroCardGridContext();

    const imageUrl = `url(${ itemImage })`;

    return (
        <div className={ `${ columns === undefined ? 'col' : ('col-' + columns) } pb-1 grid-item-container` }>
            <div className={ `grid-item ${ theme } cursor-pointer${ itemActive ? ' active' : '' }${ itemUnique ? ' unique-item' : '' }${ itemUnseen ? ' unseen' : ''}${ (itemImage === null ? ' icon loading-icon': '')} ${ className || '' }` } style={ itemImage ? { ...style, backgroundImage: imageUrl } : (itemColor ? { ...style, backgroundColor: itemColor } : style) } { ...rest }>
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
