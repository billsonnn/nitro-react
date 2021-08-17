import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../../../api';
import { CatalogEvent, CatalogNameResultEvent } from '../../../../../../../events';
import { useUiEvent } from '../../../../../../../hooks/events/ui/ui-event';
import { CatalogPetNameApprovalViewProps } from './CatalogPetNameApprovalView.types';

export const CatalogPetNameApprovalView: FC<CatalogPetNameApprovalViewProps> = props =>
{
    const { petNameValue = null, setPetNameValue = null, nameApproved = false, setNameApproved = null } = props;
    const [ validationResult, setValidationResult ] = useState(-1);

    useEffect(() =>
    {
        setValidationResult(-1);
    }, [ petNameValue ]);

    const onCatalogNameResultEvent = useCallback((event: CatalogNameResultEvent) =>
    {
        if(event.result === 0)
        {
            setNameApproved(true);

            return;
        }
        
        setValidationResult(event.result);
    }, [ setNameApproved ]);

    useUiEvent(CatalogEvent.APPROVE_NAME_RESULT, onCatalogNameResultEvent);

    const validationErrorMessage = useMemo(() =>
    {
        let key: string = '';

        switch(validationResult)
        {
            case 1:
                key = 'catalog.alert.petname.long';
                break;
            case 2:
                key = 'catalog.alert.petname.short';
                break;
            case 3:
                key = 'catalog.alert.petname.chars';
                break;
            case 4:
                key = 'catalog.alert.petname.bobba';
                break;
        }

        return LocalizeText(key);
    }, [ validationResult ]);

    return (
        <div className="input-group has-validation">
            <input type="text" className={ 'form-control form-control-sm '+ ((validationResult > 0) ? 'is-invalid ' : '') } placeholder={ LocalizeText('widgets.petpackage.name.title') } value={ petNameValue } onChange={ event => setPetNameValue(event.target.value) } />
            { (validationResult > 0) &&
                <div className="invalid-feedback">{ validationErrorMessage }</div> }
        </div>
    );
}
