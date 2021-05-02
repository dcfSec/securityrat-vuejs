export function Requirement(id, shortName, universalId, description, showOrder, optionColumnContents, tagInstances, collectionInstances, category = null, projectTypes = [], selected = false, status = true) {
    this.id = id;
    this.shortName = shortName;
    this.universalId = universalId;
    this.description = description;
    this.showOrder = showOrder;
    this.optionColumnContents = optionColumnContents;
    this.tagInstances = tagInstances;
    this.collectionInstances = collectionInstances;
    this.status = status;
    this.selected = selected;
    this.category = category;
    this.projectTypes = projectTypes;
}

export function CollectionInstance(id, name, description, showOrder, category = null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.showOrder = showOrder;
    this.category = category;
}

export function CollectionCategory(id, name, description, showOrder, active = true) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.showOrder = showOrder;
    this.active = active;
}

export function RequirementCategory(id, name, description, shortcut, showOrder, active = true, requirements = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.shortcut = shortcut;
    this.showOrder = showOrder;
    this.requirements = requirements;
    this.active = active;
}

export function OptionColumnContents(id, optionColumnId, content, optionColumnName) {
    this.id = id;
    this.optionColumnId = optionColumnId;
    this.content = content;
    this.optionColumnName = optionColumnName;

}

export function ProjectType(id, name, description, showOrder, optColumns, statusColumns) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.showOrder = showOrder;
    this.optColumns = optColumns;
    this.statusColumns = statusColumns;
}

export function TagCategory(id, name, description, showOrder, active = true) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.showOrder = showOrder;
    this.active = active;
}

export function TagInstance(id, name, description, showOrder, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.showOrder = showOrder;
    this.category = category;
}
