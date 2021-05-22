import { FC } from 'react';
import { LocalizeText } from '../../../../../../../utils/LocalizeText';
import { CatalogPetNameApprovalViewProps } from './CatalogPetNameApprovalView.types';

export const CatalogPetNameApprovalView: FC<CatalogPetNameApprovalViewProps> = props =>
{
    const { petNameValue = null, setPetNameValue = null } = props;

    return (
        <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('widgets.petpackage.name.title') } value={ petNameValue } onChange={ event => setPetNameValue(event.target.value) } />
    );
}
