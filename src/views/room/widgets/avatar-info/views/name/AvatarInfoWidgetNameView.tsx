import { FC } from 'react';
import { ObjectLocationView } from '../../../object-location/ObjectLocationView';
import { AvatarInfoWidgetNameViewProps } from './AvatarInfoWidgetNameView.types';

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { event = null } = props;

    return (
        <ObjectLocationView objectId={ event.roomIndex } category={ event.category }>
            <div className="d-flex justify-content-center align-items-center bg-dark border border-dark">
                { event.name }
            </div>
        </ObjectLocationView>
    );
}
