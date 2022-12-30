import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Base } from '../Base';

export interface LayoutSearchSavesViewProps
{
    title: string;
    onSaveSearch?: () => void;
    onClick?: () => void;
}

export const LayoutSearchSavesView: FC<LayoutSearchSavesViewProps> = props =>
{
    const { title = null, onSaveSearch = null, onClick = null } = props;

    return (
        <Base color="white" className="button-search-saves" pointer title={ title } onClickCapture={ onSaveSearch } onClick={ onClick }>
            <FontAwesomeIcon icon="bolt-lightning" />
        </Base>
    );
}
