import lunr from 'lunr';

export type SearchDocument = { id: string; title?: string; content: string };

export function buildIndex(docs: SearchDocument[]) {
  return lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('content');
    docs.forEach((d) => this.add(d));
  });
}


