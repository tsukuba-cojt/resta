import {useLayoutEffect, useState} from 'react';

const useHoveredAndSelectedElement = (): [HTMLElement | null, HTMLElement | null] => {
    const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const updateElement = () => {
            const hovers: NodeListOf<HTMLElement> = document.querySelectorAll(":hover");
            const minSize = Number.MAX_VALUE;  // 1000000じゃ小さすぎる
            let minElement: HTMLElement | null = null;

            for (const hover of Array.from(hovers)) {
                if (hover.dataset.noselect !== "true") {
                    const rect = hover.getBoundingClientRect();
                    const size = rect.width * rect.height;
                    if (size < minSize) {
                        minElement = hover;
                    }
                }
            }

            if (!minElement) {
                return;
            }

            if (minElement !== hoveredElement && !minElement.closest("#resta-root") && !minElement.closest(".ant-select-dropdown")) {
                setHoveredElement(minElement);
                const listener = () =>
                    setSelectedElement((prev) => {
                        prev?.removeEventListener("mousedown", listener);
                        return minElement;
                    });

                minElement.addEventListener("mousedown", listener);
            }
        }

        document.addEventListener("mouseover", updateElement);

        return () => document.removeEventListener("mouseover", updateElement);
    }, []);

    return [hoveredElement, selectedElement];
};

export default useHoveredAndSelectedElement;