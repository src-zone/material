import {CategorizedClassDoc} from './categorizer';
import {DocCollection, Document, Processor} from 'dgeni';
import {HeritageInfo} from 'dgeni-packages/typescript/api-doc-types/ClassLikeExportDoc';
import * as path from 'path';

/**
 * Processor to merge the members, properties, en methods of certain base
 * classes into their subclasses, and remove these base clases from the
 * DocCollection.
 */
export class ExtendsJoiner implements Processor {
  name = 'extends-joiner';
  $runBefore = ['component-grouper'];

  $process(docs: DocCollection) {
    // Map of group name to group instance.
    const hierarchy = new Map<string, string[]>();
    const allParents: string[] = [];
    const docByName = new Map<string, Document>(); 

    // get parent => children relations:
    docs.forEach(doc => {
      docByName.set(doc.name, doc);
      if (doc.extendsClauses) {
        doc.extendsClauses.forEach((base: HeritageInfo) => {
          let childName = doc.name;
          let parentName = base.text;
          if (allParents.indexOf(parentName) === -1)
          allParents.push(parentName);
          let parents = hierarchy.get(childName);
          if (parents == null) {
            parents = [];
            hierarchy.set(childName, parents);
          }
          parents.push(parentName);
        });
      }
    });

    // add parents of parents to the child => parents relations:
    let addedElements = false;
    do {
      addedElements = false;
      hierarchy.forEach((parents) => {
        for (let parent of parents.slice()) {
          if (hierarchy.has(parent))
            if (this.addIfNew(parent, parents, <string[]>hierarchy.get(parent)))
              addedElements = true;
        }
      });
    } while(addedElements);

    // remove all non-leaf elements from the hierarchy (i.e. parents of some other element),
    // and also remove them from the DocCollection:
    for (let parent of allParents)
      hierarchy.delete(parent);
    docs = docs.filter(doc => (allParents.indexOf(doc.name) === -1));
    
    // move parent documentation into their children:
    hierarchy.forEach((parents, child) => {
      for (let parent of parents) {
        let parentDoc = docByName.get(parent);
        let childDoc = docByName.get(child);
        if (parentDoc != null && childDoc != null) {
          childDoc.members.unshift(...parentDoc.members);
          childDoc.methods.unshift(...parentDoc.methods);
          childDoc.properties.unshift(...parentDoc.properties);
        }
      }
    });

    return docs;
  }

  private addIfNew(before: string, elements: string[], additions: string[]) {
    let addedElements = false;
    let index = elements.indexOf(before);
    if (index == -1)
      index = 0;
    for (let addition of additions)
      if (elements.indexOf(addition) == -1) {
        elements.splice(index++, 0, addition);
        addedElements = true;
      }
    return addedElements;
  }
}