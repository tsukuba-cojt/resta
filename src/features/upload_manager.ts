import {getFormatByURL} from "./output_style";

export const enableRestaAddStyleButton = (onClick: () => void) => {
    const mutationObserver = new MutationObserver(() => {
        const addButton = document.getElementById('resta-add-style');
        if (addButton) {
            addButton.style.display = "block";
            addButton.addEventListener('click', onClick);
            mutationObserver.disconnect();
        }
    });

    mutationObserver.observe(
        document.getElementById('__next')!,
        {
            childList: true,
            subtree: true
        }
    );
}

export const injectStyleJson = async (url: string) => {
    (document.getElementById('resta-style-json') as HTMLInputElement).value = JSON.stringify(await getFormatByURL(url));
}