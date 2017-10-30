import { Dgeni, Package } from 'dgeni';
import { DocsPrivateFilter } from './processors/docs-private-filter';
import { Categorizer } from './processors/categorizer';
import { ExtendsJoiner } from './processors/extends-joiner';
import { ComponentGrouper } from './processors/component-grouper';
import { ReadTypeScriptModules } from 'dgeni-packages/typescript/processors/readTypeScriptModules';
import { TsParser } from 'dgeni-packages/typescript/services/TsParser';
import { sync as globSync } from 'glob';
import * as path from 'path';

const jsdocPackage = require('dgeni-packages/jsdoc');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typescriptPackage = require('dgeni-packages/typescript');

// Project configuration.
const projectRootDir = path.resolve(__dirname, '../..');
const sourceDir = path.resolve(projectRootDir, 'src');
const outputDir = path.resolve(projectRootDir, 'apidocs');
const templateDir = path.resolve(__dirname, './templates');

const dgeniPackageDeps = [
  jsdocPackage,
  nunjucksPackage,
  typescriptPackage,
];

// List of components that need to be documented:
const componentPackages = globSync(path.join(sourceDir, 'components', '*/'))
  .map(componentPath => path.basename(componentPath));

export const apiDocsPackage = new Package('material-api-docs', dgeniPackageDeps);

// Processor that filters out symbols that should not be shown in the docs.
apiDocsPackage.processor(new DocsPrivateFilter());

// Processor that appends categorization flags to the docs, e.g. `isDirective`, `isNgModule`, etc.
apiDocsPackage.processor(new Categorizer());

// Processor to move some base class information into their subclasses:
apiDocsPackage.processor(new ExtendsJoiner());

// Processor to group components into top-level groups (per mdc component):
apiDocsPackage.processor(new ComponentGrouper());

// Configure the log level of the API docs dgeni package.
apiDocsPackage.config((log: any) => log.level = 'info');

// Configure the processor for reading files from the file system.
apiDocsPackage.config((readFilesProcessor: any, writeFilesProcessor: any) => {
  readFilesProcessor.basePath = sourceDir;
  readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules

  writeFilesProcessor.outputFolder = outputDir;
});

// Configure the output path for written files (i.e., file names).
apiDocsPackage.config((computePathsProcessor: any) => {
  computePathsProcessor.pathTemplates = [{
    docTypes: ['componentGroup'],
    pathTemplate: '${name}',
    outputPathTemplate: '${name}.html',
  }];
});

// Configure custom JsDoc tags.
apiDocsPackage.config((parseTagsProcessor: any) => {
  parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
    {name: 'docs-private'}
  ]);
});

// Configure the processor for understanding TypeScript.
apiDocsPackage.config((readTypeScriptModules: ReadTypeScriptModules, tsParser: TsParser) => {
  readTypeScriptModules.basePath = sourceDir;
  readTypeScriptModules.ignoreExportsMatching = [/^_/];
  readTypeScriptModules.hidePrivateMembers = true;

  const typescriptPathMap: any = {};

  // Entry points for docs generation. All publically exported symbols found through
  // readTypeScriptModules.sourceFiles will have docs generated.
  readTypeScriptModules.sourceFiles = [];
  componentPackages.forEach(componentName => {
    const componentSources = globSync(path.join(sourceDir, 'components', componentName, '*.ts'))
      .map(sourcePath => `./components/${componentName}/` + path.basename(sourcePath));
    typescriptPathMap[`@blox/material/${componentName}`] = componentSources;
    readTypeScriptModules.sourceFiles.push(...componentSources);
  });

  tsParser.options.baseUrl = sourceDir;
  tsParser.options.paths = typescriptPathMap;
});

// Configure processor for finding nunjucks templates.
apiDocsPackage.config((templateFinder: any, templateEngine: any) => {
  // Where to find the templates for the doc rendering
  templateFinder.templateFolders = [templateDir];

  // Standard patterns for matching docs to templates
  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html',
    '${ doc.id }.${ doc.docType }.template.js',
    '${ doc.id }.template.js',
    '${ doc.docType }.template.js',
    '${ doc.id }.${ doc.docType }.template.json',
    '${ doc.id }.template.json',
    '${ doc.docType }.template.json',
    'common.template.html'
  ];

  // dgeni disables autoescape by default, but we want this turned on.
  templateEngine.config.autoescape = true;

  // Nunjucks and Angular conflict in their template bindings so change Nunjucks
  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };
});

const docs = new Dgeni([apiDocsPackage]);
docs.generate().then(function(docs: any) {
  console.log(docs.length, 'docs generated');
});
