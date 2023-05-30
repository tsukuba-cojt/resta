import React, {useEffect} from "react";
import useHoveredAndSelectedElement from "../hooks/useHoveredAndSelectedElement";

const ElementSelector = () => {
    const HOVERED_PADDING_COLOR = '#81C78480';
    const HOVERED_BACKGROUND_COLOR = '#64B5F680';
    const HOVERED_COLOR = 'rgba(0, 0, 255, 0.3)';
    /*
    const SELECTED_PADDING_COLOR = '#FF000080';
    const SELECTED_BACKGROUND_COLOR = '#00FF0080';
    const SELECTED_COLOR = 'rgba(255, 0, 0, 0.4)';
     */

    const [hoveredElement, _/* selectedElement */] = useHoveredAndSelectedElement();

    useEffect(() => {
        if (hoveredElement) {
            const previousBorder = hoveredElement.style.border;
            const previousBackgroundImage = hoveredElement.style.backgroundImage;
            const previousBackgroundClip = hoveredElement.style.backgroundClip;

            if (hoveredElement.tagName === "IMG") {
                hoveredElement.style.border = `2px solid  ${HOVERED_COLOR}`;

            } else {
                hoveredElement.style.backgroundImage = `linear-gradient(to bottom, ${HOVERED_BACKGROUND_COLOR} 0%, ${HOVERED_BACKGROUND_COLOR} 100%), linear-gradient(to bottom, ${HOVERED_PADDING_COLOR} 0%, ${HOVERED_PADDING_COLOR} 100%)`;
                hoveredElement.style.backgroundClip = 'content-box, padding-box';
            }

            hoveredElement.addEventListener('mouseout', () => {
                hoveredElement.style.border = previousBorder;
                hoveredElement.style.backgroundImage = previousBackgroundImage;
                hoveredElement.style.backgroundClip = previousBackgroundClip;
            }, {once: true});
        }
    }, [hoveredElement]);

    /*
    現状クリック時に色を変えることがバグの温床となっているので無効化
    useEffect(() => {
        if (selectedElement) {
            const previousBorder = selectedElement.style.border;
            const previousBackgroundImage = selectedElement.style.backgroundImage;
            const previousBackgroundClip = selectedElement.style.backgroundClip;

            if (selectedElement.tagName === "IMG") {
                selectedElement.style.border = `2px solid ${SELECTED_COLOR}`;

            } else {
                selectedElement.style.backgroundImage = `linear-gradient(to bottom, ${SELECTED_PADDING_COLOR} 0%, ${SELECTED_PADDING_COLOR} 100%), linear-gradient(to bottom, ${SELECTED_BACKGROUND_COLOR} 0%, ${SELECTED_BACKGROUND_COLOR} 100%)`;
                selectedElement.style.backgroundClip = 'content-box, padding-box';
            }
        }
    }, [selectedElement]);

     */

    return <></>;
}

export default ElementSelector;