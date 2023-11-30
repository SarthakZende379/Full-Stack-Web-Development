/** a link contains a href URL and HTTP method */
export type Link = {
  rel: string,
  href: string,
  method: string
};

/** a self link using rel self */
export type SelfLinks = {
  self: Link & { rel: 'self' },
};

/** navigation links contain optional next and prev links in addition to
 *  a self link.
 */
export type NavLinks = SelfLinks & {
  next?: Link & { rel: 'next' },
  prev?: Link & { rel: 'prev' },
};

/** a result of type T which has a links containing a self-link */
type LinkedResult<T> = {
  links: SelfLinks,
  result: T,
};

/** a response envelope always has an isOk and HTTP status */
type Envelope = {
  isOk: boolean,
  status: number,
};


/** an envelope for a non-paged successful response */
export type SuccessEnvelope<T> = Envelope & LinkedResult<T> & {
  isOk: true,
};

/** an envelope for a paged successful response */
export type PagedEnvelope<T> = Envelope & {
  isOk: true,
  links: NavLinks,
  result: LinkedResult<T>[],
};

/** an envelope for a failed response */
export type ErrorEnvelope = Envelope & {
  isOk: false,
  errors: { message: string, options?: { [key:string]: string } }[],
};
