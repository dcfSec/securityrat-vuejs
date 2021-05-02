import {
    CollectionCategory,
    CollectionInstance,
    OptionColumnContents,
    ProjectType,
    Requirement,
    RequirementCategory,
    Tag, TagInstance
} from "../Data/objects.mjs";


export class RestData {

    constructor(apiURL) {
        this.apiURL = apiURL;
        this.requirementSkeletons = null;
        this.requirementCategories = null;
        this.tagCategories = null;
        this.tagInstances = null;
        this.projectTypes = null;
        this.collectionInstances = null;
        this.collectionCategories = null;
    }

    async getData() {

        this.requirementCategories = await this.getRequirementCategories();
        this.requirementSkeletons = await this.getRequirementSkeletons();

        this.collectionCategories = await this.getCollectionCategories();
        this.collectionInstances = await this.getCollectionInstances();

        this.projectTypes = await this.getProjectTypes();

        this.tagCategories = await this.getTagCategories();
        this.tagInstances = await this.getTagInstances();

    }

    hasLoaded() {
        return this.requirementSkeletons !== null && this.requirementCategories !== null && this.tagCategories !== null && this.tagInstances !== null && this.projectTypes !== null && this.collectionInstances !== null && this.collectionCategories !== null
    }

    sortWithCategory(list, category) {
        let localCat = category
        list.sort(function (a, b) {
            if (localCat.get(a.category).showOrder < localCat.get(b.category).showOrder) return -1;
            if (localCat.get(a.category).showOrder > localCat.get(b.category).showOrder) return 1;

            if (a.showOrder < b.showOrder) return -1;
            if (a.showOrder > b.showOrder) return 1;
        });
    }

    async getTagCategories() {
        return await fetch(this.apiURL + 'api/tagCategorys?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(tagCategories => {
            let list = []
            tagCategories.forEach(function (item) {
                list.push(new TagInstance(item['id'], item['name'], item['description'], item['showOrder'], item['active']));
            });
            list.sort((a, b) => a.showOrder - b.showOrder);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map;
        }).catch(error => {
            console.log(error)
        });
    }

    async getTagInstances() {
        return await fetch(this.apiURL + 'api/tagInstances?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(tagInstances => {
            let list = []
            tagInstances.forEach(function (item) {
                list.push(new TagInstance(item['id'], item['name'], item['description'], item['showOrder'], item['tagCategory']['id']));
            });
            this.sortWithCategory(list, this.tagCategories);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map;
        }).catch(error => {
            console.log(error)
        });
    }

    async getProjectTypes() {
        return await fetch(this.apiURL + 'api/projectTypes?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(projectTypes => {
            let list = []
            projectTypes.forEach(function (item) {
                let optionalColumns = item["optColumns"]
                optionalColumns.sort((a, b) => a.showOrder - b.showOrder)
                let optionalColumnsIDs = []
                optionalColumns.forEach(function (iItem) {
                    optionalColumnsIDs.push(iItem['id'])
                });

                let statusColumns = item["statusColumns"]
                statusColumns.sort((a, b) => a.showOrder - b.showOrder)
                let statusColumnsIDs = []
                statusColumns.forEach(function (iItem) {
                    statusColumnsIDs.push(iItem['id'])
                });
                list.push(new ProjectType(item['id'], item['name'], item['description'], item['showOrder'], item['active'], optionalColumnsIDs, statusColumnsIDs));
            });
            list.sort((a, b) => a.showOrder - b.showOrder);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map;
        }).catch(error => {
            console.log(error)
        });
    }

    async getCollectionCategories() {
        return await fetch(this.apiURL + 'api/collectionCategorys?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(collectionCategories => {
            let list = []
            collectionCategories.forEach(function (item) {
                list.push(new CollectionCategory(item['id'], item['name'], item['description'], item['showOrder'], item['active']));
            });
            list.sort((a, b) => a.showOrder - b.showOrder);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map;
        }).catch(error => {
            console.log(error)
        });
    }

    async getCollectionInstances() {
        return await fetch(this.apiURL + 'api/collectionInstances?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(collectionInstances => {
            let list = []
            collectionInstances.forEach(function (item) {
                list.push(new CollectionInstance(item['id'], item['name'], item['description'], item['showOrder'], item['collectionCategory']['id']));
            });
            this.sortWithCategory(list, this.collectionCategories);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map
        }).catch(error => {
            console.log(error)
        });
    }

    async getRequirementCategories() {
        return await fetch(this.apiURL + 'api/reqCategorys?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(reqCategories => {
            let list = []
            reqCategories.forEach(function (item) {
                list.push(new RequirementCategory(item['id'], item['name'], item['shortcut'], item['description'], item['showOrder'], [], item['active']));
            });
            list.sort((a, b) => a.showOrder - b.showOrder);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map;
        }).catch(error => {
            console.log(error)
        });
    }


    async getRequirementSkeletons(/*requirementSkeletons */) {
        return await fetch(this.apiURL + 'api/requirementSkeletons?cacheBuster=' + Math.floor(100000 + Math.random() * 900000)
        ).then(response => response.json()).then(requirementSkeletons => {
            let list = []
            requirementSkeletons.forEach(function (item) {
                let collectionInstances = item["collectionInstances"]
                collectionInstances.sort((a, b) => a.showOrder - b.showOrder)
                let collectionInstancesIDs = []
                collectionInstances.forEach(function (iItem) {
                    collectionInstancesIDs.push(iItem['id'])
                });
                let projectTypes = item["projectTypes"]
                projectTypes.sort((a, b) => a.showOrder - b.showOrder)
                let projectTypesIDs = []
                projectTypes.forEach(function (iItem) {
                    projectTypesIDs.push(iItem['id'])
                });

                let optionColumnContents = item["projectTypes"]
                let optionColumnContentsIDs = []
                optionColumnContents.forEach(function (iItem) {
                    optionColumnContentsIDs.push(iItem['id'])
                });
                let tagInstances = item["tagInstances"]
                let tagInstanceIDs = []
                tagInstances.forEach(function (iItem) {
                    tagInstanceIDs.push(iItem['id'])
                });
                list.push(new Requirement(item['id'], item['shortName'], item['universalId'], item['description'], item['showOrder'], optionColumnContentsIDs, tagInstanceIDs, collectionInstancesIDs, item['reqCategory']['id'], projectTypesIDs, false, item['active']));
            });
            this.sortWithCategory(list, this.requirementCategories);

            let map = new Map()
            list.forEach(function (item) {
                map.set(item['id'], item)
            });
            return map
        }).catch(error => {
            console.log(error)
        });
    }
}

