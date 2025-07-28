// generateUML.js
import fs from 'fs';
import mongoose from 'mongoose';

import { User, OverviewModel, TopGainerModel, TopLoserModel, WatchlistItem, Notification } from './models/index.model.js';

const models = {
  User,
  OverviewModel,
  TopGainerModel,
  TopLoserModel,
  WatchlistItem,
  Notification,
};

function getFieldType(value) {
  if (value.instance) return value.instance;
  if (value.options && value.options.type) {
    if (Array.isArray(value.options.type)) return `Array<${typeof value.options.type[0]}>`;
    return typeof value.options.type;
  }
  return 'Mixed';
}

function generateClassBlock(model, name) {
  const paths = model.schema.paths;
  let block = `class ${name} {\n`;

  for (const [field, fieldSchema] of Object.entries(paths)) {
    if (field !== '__v') {
      block += `  ${field}: ${getFieldType(fieldSchema)}\n`;
    }
  }

  block += '}\n';
  return block;
}

let diagram = '@startuml\n';
for (const [name, model] of Object.entries(models)) {
  diagram += generateClassBlock(model, name) + '\n';
}
diagram += '@enduml\n';

fs.writeFileSync('models.puml', diagram);
console.log('✅ UML PlantUML file generated: models.puml');
