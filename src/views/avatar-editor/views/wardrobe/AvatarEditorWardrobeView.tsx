import { FC, useMemo } from 'react';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { NitroCardGridThemes } from '../../../../layout/card/grid/NitroCardGridView.types';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { AvatarEditorWardrobeViewProps } from './AvatarEditorWardrobeView.types';

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = props =>
{
    const { figures = [] } = props;

    const savedFigures = useMemo(() =>
    {
        if(!figures) return [];

        let i = 0;

        const items: JSX.Element[] = [];

        while(i < figures.length)
        {
            const figure = figures[i];

            let figureString = null;
            let gender = null;

            if(figure)
            {
                figureString = (figure[0] || null);
                gender = (figure[1] || null);
            }

            items.push(
                <NitroCardGridItemView key={ i } columns={ 2 }>
                    <AvatarImageView figure={ figureString } gender={ gender } />
                </NitroCardGridItemView>
            );
            
            i++
        }

        return items;
    }, [ figures ]);

    console.log(figures.length);

    return (
        <div className="row h-100">
            <div className="col-12 d-flex h-100">
                <NitroCardGridView className="wardrobe-grid" columns={ 12 } theme={ NitroCardGridThemes.THEME_DEFAULT }>
                    { savedFigures }
                </NitroCardGridView>
            </div>
        </div>
    );
}
