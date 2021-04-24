import { FC } from 'react';
import { LocalizeText } from '../../../utils/LocalizeText';
import { NavigatorSearchViewProps } from './NavigatorSearchView.types';

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    return (
        <div className="d-flex input-group px-3 mb-1">
            <div className="input-group-prepend">
                <button type="button" className="btn btn-secondary btn-sm" >{ LocalizeText('navigator.filter.') }</button>
                <div className="dropdown-menu">
                    <button className="dropdown-item">{ LocalizeText('navigator.filter.') }</button>
                </div>
            </div>
            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } />
        </div>
    );
}
