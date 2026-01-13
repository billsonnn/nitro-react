import { ChangeEvent, FC } from "react"

export interface WiredMessageViewProps
{
    title: string;
    value: string | number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number;
}

export const WiredMessageView: FC<WiredMessageViewProps> = props =>
{
    const { title = "", value = "", onChange, maxLength = 100 } = props
    return (
        <>
            <p className="mb-1.5 px-0.5 font-volter_bold">{ title }</p>
            <input type="text" value={ value } onChange={ onChange } maxLength={ maxLength } />
        </>
    )
}
