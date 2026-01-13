import { FC, useState } from "react"
import { LocalizeText } from "../../api"
import { LayoutAvatarImageView } from "./LayoutAvatarImageView"

interface LayoutGiftTagViewProps {
    figure?: string;
    userName?: string;
    message?: string;
    editable?: boolean;
    onChange?: (value: string) => void;
}

export const LayoutGiftTagView: FC<LayoutGiftTagViewProps> = (props) => {
    const { figure = null, userName = null, message = null, editable = false, onChange = null } = props
    const [ inputValue, setInputValue ] = useState<string>(message || "")

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const lines = e.target.value.split("\n")
        const truncatedLines = lines.map((line) => line.slice(0, 33))
        const truncatedValue = truncatedLines.join("\n")
        setInputValue(truncatedValue)
        if (onChange) onChange(truncatedValue)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        const pastedText = e.clipboardData.getData("text/plain")
        const lines = pastedText.split("\n")
        const truncatedLines = lines.map((line) => line.slice(0, 33))
        const truncatedText = truncatedLines.join("\n")
        document.execCommand("insertText", false, truncatedText)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const lines = inputValue.split("\n")
        const currentLineIndex = inputValue.substr(0, e.currentTarget.selectionStart).split("\n").length - 1
        if (currentLineIndex < 4 && lines[currentLineIndex].length >= 33 && e.key !== "Backspace" && e.key !== "Delete") {
            e.preventDefault()
        }
        if (e.key === "Enter" && lines.length >= 5) {
            e.preventDefault()
        }
    }

    return (
        <div className="flex h-[149px] w-[306px] bg-[url('/client-assets/images/catalogue/gift-tag-bg.png?v=2451779')] dark:bg-[url('/client-assets/images/catalogue/gift-tag-dark-bg.png?v=2451779')]">
            <div className="flex h-full w-[65px] shrink-0 items-center justify-center">
                {!userName && <i className="h-12 w-[37px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" />}
                {figure && <LayoutAvatarImageView className="!bg-[center_5px]" figure={figure} direction={2} headOnly={true} />}
            </div>
            <div className="flex w-full flex-col p-6 pl-4">
                {!editable && <p className="h-full text-sm">{inputValue}</p>}
                {editable && (
                    <textarea
                        className="h-full text-sm placeholder:italic"
                        spellCheck={ false }
                        value={inputValue}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        placeholder={LocalizeText("catalog.gift_wrapping_new.message_hint")}
                    />
                )}
                {userName && (
                    <p className="pr-1 text-right text-sm italic text-black">
                        {LocalizeText("catalog.gift_wrapping_new.message_from", [ "name" ], [ userName ])}
                    </p>
                )}
            </div>
        </div>
    )
}
