import { FC } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorSearchViewProps } from './NavigatorSearchView.types';

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    return (
        <div className="d-flex mb-1">
            <div className="flex-grow-1 input-group">
                <button type="button" className="btn btn-primary btn-sm dropdown-toggle">{ LocalizeText('navigator.filter.') }</button>
                <ul className="dropdown-menu">
                    <li>
                        <p className="dropdown-item">{ LocalizeText('navigator.filter.') }</p>
                    </li>
                </ul>
                <input type="text" className="form-control form-control-sm" />
            </div>
            <div className="ms-1 d-flex">
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    );
}
