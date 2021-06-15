import { FC } from 'react';
import { ObjectLocationView } from '../../../object-location/ObjectLocationView';
import { AvatarInfoWidgetNameViewProps } from './AvatarInfoWidgetNameView.types';

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameData = null } = props;
    const { objectId = -1, category = -1, id = -1, name = '', type = '' } = nameData;

    return (
        <ObjectLocationView objectId={ objectId } category={ category }>
            <div className="d-flex justify-content-center align-items-center bg-dark border border-dark">
                { name }
            </div>
        </ObjectLocationView>
    );
}
