export type TemplateCategory = {
  category: string;
  name: string;
  templates: Template[]
}

export type Template = {
  name: string;
  tags: string[];
  styles: TemplateStyle[];
}

export type TemplateStyle = {
  pseudoClass?: string;
  css: {[key: string]: string};
}