import { GuideSessionCreateMessageComposer } from "@nitrots/nitro-renderer"
import { FC, MouseEvent } from "react"
import { LocalizeText, SendMessageComposer } from "../../../api"
import { Button } from "../../../common"

interface GuideToolUserCreateRequestViewProps
{
    userRequest: string;
    setUserRequest: (value: string) => void;
    onCloseClick: (event: MouseEvent) => void;
}

const MIN_REQUEST_LENGTH: number = 15

export const GuideToolUserCreateRequestView: FC<GuideToolUserCreateRequestViewProps> = props =>
{
    const { userRequest = "", setUserRequest = null, onCloseClick = null } = props

    const sendRequest = () =>
    {
        if(userRequest.length > MIN_REQUEST_LENGTH) {
            SendMessageComposer(new GuideSessionCreateMessageComposer(1, userRequest))
        }
    }

    return (
        <>
            <p className="mb-3 text-[13px]">{ LocalizeText("guide.help.request.user.create.help") }</p>
            <textarea className="illumina-input h-[95px] w-full p-2 !text-[13px]" spellCheck={ false } maxLength={ 140 } value={ userRequest } onChange={ event => setUserRequest(event.target.value) } onKeyDown={event => { if (event.key === "Enter") { event.preventDefault() }}} placeholder={ LocalizeText("guide.help.request.user.create.input.help") }></textarea>
            <div className="relative mt-3 h-[98px]">
                <div className="absolute left-0 top-[-33px] h-[120px] w-[81px] bg-[url('/client-assets/images/help/help-request.png?v=2451779')] dark:bg-[url('/client-assets/images/help/help-request-dark.png?v=2451779')]" />
                <div className="ml-[30px] flex flex-col items-center gap-3">
                    <Button onClick={ sendRequest }>{ LocalizeText("guide.help.request.user.create.input.button") }</Button>
                    <Button variant="underline" onClick={ onCloseClick }>{ LocalizeText("guide.help.request.emergency.cancel.link") }</Button>
                </div>
            </div>
        </>
    )
}
