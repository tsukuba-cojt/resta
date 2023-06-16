export type TemplateCategory = {
  category: string;
  name: string;
  templates: Template[]
}

export type Template = {
  name: string;
  styles: TemplateStyle[];
}

export type TemplateStyle = {
  tags?: string[];
  pseudoClasses?: string[];
  css: {[key: string]: string};
}