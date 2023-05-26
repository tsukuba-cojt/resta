export type ContentLayout = {
    icon: string;
    parts: LayoutPart[];
}

export type PartSelect = LayoutPart & {
    options: string[];
    type: "select";
}

export type PartInputText = LayoutPart & {
    placeHolder?: string;
    defaultValue?: string;
    type: "text";
}

export type PartInputNumber = LayoutPart & {
    placeHolder?: string;
    defaultValue?: string;
    type: "number";
}

export type PartToggle = LayoutPart & {
    options: [];
    defaultSelect?: string;
    type: "toggle";
}

export type PartLabel = LayoutPart & {
    text: string;
    type: "label";
}

export type PartColor = LayoutPart & {
    defaultColor?: string;
    type: "color";
}

export type LayoutPart = {
    type: "select" | "text" | "number" | "toggle" | "label" | "color";
}