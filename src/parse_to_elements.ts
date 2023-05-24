/*
value::=element | element ":" value
element::=select | input | rawtext
select::="<" items ">"
items::=item | item "|" items
item::=\w+
input::=# ("number" | "color" | "text")
rawtext::=\w+
*/

export enum ElementType {
  SELECT,
  INPUT,
  RAWTEXT,
}

export const parseToElements = (value: string) => {
  const result: Array<HTMLElement> = [];
  for (const styleObject of parser(value)) {
    if (styleObject.type === ElementType.SELECT) {
      const select = document.createElement('select');
      for (const item of styleObject.values) {
        const option = document.createElement('option');
        option.textContent = item;
        select.appendChild(option);
      }
      result.push(select);
    } else if (styleObject.type === ElementType.INPUT) {
      const input = document.createElement('input');
      input.type = styleObject.values[0];
      result.push(input);
    } else if (styleObject.type === ElementType.RAWTEXT) {
      const span = document.createElement('span');
      span.textContent = styleObject.values[0];
      result.push(span);
    }
  }
  return result;
};

// [{type:select, values:["normal", "bold"]}, { ... }] のようなオブジェクトを返す
const parser = (value: string) => {
  const result: Array<any> = [];
  let index = 0;
  while (index < value.length) {
    let lexime = value[index++];
    let values: Array<string>;
    let type: ElementType;
    if (lexime === '<') {
      type = ElementType.SELECT;
      lexime = '';
      do {
        lexime += value[index++];
      } while (index < value.length && value[index] !== '>');
      // いまの value[index] は '>' なので、index を 2 進める
      index += 2;

      values = lexime.split('|');
    } else if (lexime === '#') {
      type = ElementType.INPUT;
      lexime = '';
      do {
        lexime += value[index++];
      } while (index < value.length && value[index] !== ':');

      index++;

      if (['number', 'color', 'text'].includes(lexime)) {
        values = [lexime];
      } else {
        console.log('Error(parse_to_elements.ts): Invalid input type', lexime);
        break;
      }
    } else {
      type = ElementType.RAWTEXT;
      lexime = '';
      do {
        lexime += value[index++];
      } while (index < value.length && value[index] !== ':');

      index++;

      values = [lexime];
    }
    result.push({ type: type, values: values });
  }
  console.log(result);
  return result;
};
