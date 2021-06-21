import { AuthField } from './../../AuthView.types';

export interface AuthFormViewProps
{
    fields: AuthField[];
    setFieldValue: (key: string, value: string | number) => void;
    isLoading: boolean;
}
