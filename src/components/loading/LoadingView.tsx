import { FC, useEffect, useState } from "react"
import { GetConfiguration, LocalizeText } from "../../api"
import { Button } from "../../common"

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const [ randomImage, setRandomImage ] = useState<string | null>(null)
    const images = GetConfiguration<string[]>("illumina.loading.images")
    const reloadHref: string = GetConfiguration<string>("illumina.loading.reload.button.url")

    const { isError = false, message = "", percent = 0 } = props

    // Show random image
    useEffect(() => {
        if (images && images.length > 0) {
            const randomIndex = Math.floor(Math.random() * images.length)
            setRandomImage(images[randomIndex])
        }
    }, [ images ])

    const handleReloadHref = () => {
        if(reloadHref === "default" || reloadHref === null || reloadHref === "") {
            window.location.reload()
        } else {
            window.location.href = reloadHref
        }
    }
    
    // Debug error
    console.log(message)
    
    return (
        <div className="relative flex h-screen w-full items-center justify-center bg-[#1b1b1b] bg-cover">
            <div className="z-10 flex flex-col items-center">
                <div className="illumina-loading relative mb-8 flex size-[360px] items-center justify-center">
                    <img src={ GetConfiguration("illumina.loading.logo") } decoding="async" className={"logo-position absolute top-[-50px] [filter:drop-shadow(2px_2px_0px_#fff)_drop-shadow(-2px_0px_0px_#fff)_drop-shadow(0px_-2px_0px_#fff)]"} />
                    <div className="size-[calc(100%-5px)] rounded bg-cover bg-center" style={{ backgroundImage: `url(${randomImage || ""})` }} />
                </div>
                <p className="mb-3 text-[15px] text-white">{ GetConfiguration<string[]>("illumina.loading.text") } ({percent}%)</p>
                <div className="illumina-progress-bar relative h-[30px] w-[300px]">
                    <div className="illumina-progress-bar-percent absolute left-0.5 top-0.5 h-[calc(100%-4px)] max-w-[calc(100%-2px)] transition-all duration-1000 ease-in-out	" style={{ width: `${percent}%` }} />
                </div>
            </div>
            {isError && (
                <div className="absolute left-0 top-0 z-[999] flex size-full items-center justify-center bg-[#1b1b1bd9]">
                    <div className="flex max-w-[400px] flex-col items-center">
                        <i className="mb-[3px] h-12 w-[37px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')]" />
                        <div className="mb-1.5 text-center text-[18px] font-semibold text-white [text-shadow:_0_1px_0_#33312B]">{ LocalizeText("nitro.illumina.loading.error.title") }</div>
                        <p className="mb-3 text-center text-sm text-white">{ LocalizeText("nitro.illumina.loading.error.text") }</p>
                        <Button variant="success" className="w-fit px-5 py-2 text-sm" onClick={ handleReloadHref }>{ LocalizeText("nitro.illumina.loading.error.reload.button") }</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
