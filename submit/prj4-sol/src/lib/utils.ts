/** Return a new DOM element with specified tagName, attributes
 *  given by object attrs and initial contained text.
 *  Note that .append(TextOrElement...) can be called on the returned
 *  element to append string text or a new DOM element to it.
 */
export function makeElement(tagName: string,
			    attrs: {[attr: string]: string} = {},
			    text='')
  : HTMLElement
{
  const element = document.createElement(tagName);
  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v);
  }
  if (text.length > 0) element.append(text);
  return element;
}

/** Return a key-value mapping for all data from form */
export function getFormData(form: HTMLFormElement) : Record<string, string> {
  const pairs =
    [...new FormData(form).entries()]
    .map(([k, v]) => [k, v as string])
    .filter(([_, v]) => v.trim().length > 0);
  return Object.fromEntries(pairs);
}
