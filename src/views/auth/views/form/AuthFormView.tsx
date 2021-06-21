import { FC, useCallback } from 'react';
import { AuthFormViewProps } from './AuthFormView.types';

export const AuthFormView: FC<AuthFormViewProps> = props =>
{
    const { fields = null, setFieldValue = null, isLoading = null } = props;

    const getFieldValue = useCallback((key: string) =>
    {
        const field = fields.find(field => field.name === key);

        if(!field) return;

        return field.value;
    }, [ fields ]);

    if(!fields) return null;

    return (<>
        <div className="row mt-3">
            { fields.map(field =>
            {
                return <div key={ field.name } className={ "mb-3 col-md-" + field.col }>
                    <h5>{ field.label }</h5>
                    <input type={ field.type } disabled={ isLoading } className="form-control" name={ field.name } value={ getFieldValue(field.name) || '' } onChange={(event) => setFieldValue(field.name, event.target.value.toString())} />
                </div>;
            }) }
        </div>
    </>);
}
