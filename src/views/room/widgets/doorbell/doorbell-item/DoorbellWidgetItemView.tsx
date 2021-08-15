import { FC } from 'react';
import { DoorbellWidgetItemViewProps } from './DoorbellWidgetItemView.types';

export const DoorbellWidgetItemView: FC<DoorbellWidgetItemViewProps> = props =>
{
    const { userName = '', accept = null, deny = null } = props;

    return (
        <div className="d-flex col align-items-center justify-content-between">
            <span className="fw-bold text-black">{ userName }</span>
            <div>
                <button type="button" className="btn btn-success btn-sm me-1" onClick={ accept }>
                    <i className="fas fa-check" />
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={ deny }>
                    <i className="fas fa-times" />
                </button>
            </div>
        </div>
    );
}
