import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import activities from "../models/activities";
import activitytypes from "../models/activitytypes";
import contacts from "../models/contacts";
import files from "../models/files";
import PopupView from "./windows/popup";

export default class ContactsTableView extends JetView {
	config() {
		const activitiesTable = {
			id: "activitiesCell",
			rows: [
				{
					view: "datatable",
					localId: "activities",
					columns: [
						{
							id: "State",
							header: "",
							template: "{common.checkbox()}",
							checkValue: "Close",
							uncheckValue: "Open",
							width: 50
						},
						{
							id: "TypeID",
							header: {content: "selectFilter"},
							collection: activitytypes,
							sort: "text"
						},
						{
							id: "date",
							format: webix.Date.dateToStr("%d %M %Y"),
							header: {
								content: "dateRangeFilter",
								inputConfig: {format: webix.Date.dateToStr("%d %M %Y")}
							},
							width: 200,
							sort: "date"
						},
						{id: "Details", header: {content: "textFilter"}, sort: "string", fillspace: true},
						{id: "edit", header: "", template: "{common.editIcon()}", width: 50},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							showConfirmMessage(id, activities, "activity");
							return false;
						},
						"wxi-pencil": (e, id) => {
							this.popup.showWindow(true, "Edit", "Save", id);
						}
					}
				},
				{
					cols: [
						{},
						{
							view: "button",
							value: "Add activity",
							css: "webix_primary",
							width: 200,
							click: () => this.popup.showWindow(true, "Add", "Add")
						}
					]
				}
			]
		};

		const filesTable = {
			id: "filesCell",
			rows: [
				{
					view: "datatable",
					localId: "files",
					columns: [
						{
							id: "name",
							header: "Name",
							fillspace: true,
							sort: "text"
						},
						{
							id: "lastModifiedDate",
							header: "Change date",
							format: webix.Date.dateToStr("%d %M %Y"),
							sort: "date",
							width: 200
						},
						{
							id: "sizetext",
							header: "Size",
							sort: "text"
						},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							showConfirmMessage(id, files, "file");
							return false;
						}
					}
				},
				{
					view: "uploader",
					autosend: false,
					value: "Upload file",
					link: files,
					on: {
						onBeforeFileAdd: (upload) => {
							upload.lastModifiedDate = upload.file.lastModifiedDate;
							upload.contact = this.id;
						},
						onAfterFileAdd: () => {
							files.filter(obj => obj.contact === this.id);
						}
					}
				}
			]
		};

		return {
			rows: [
				{
					view: "tabbar",
					localId: "tabbar",
					multiview: true,
					options: [
						{value: "Activities", id: "activitiesCell"},
						{value: "Files", id: "filesCell"}
					]
				},
				{
					view: "multiview",
					cells: [activitiesTable, filesTable]
				}
			]
		};
	}

	init() {
		this.activitiesTable = this.$$("activities");
		this.filesTable = this.$$("files");
		this.popup = this.ui(PopupView);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData,
			files.waitData
		]).then(() => {
			this.id = this.getParam("id", true);
			if (contacts.exists(this.id)) {
				activities.filter(obj => obj.ContactID * 1 === this.id * 1);
				files.filter(obj => obj.contact * 1 === this.id * 1);
				this.activitiesTable.sync(activities);
				this.filesTable.sync(files);
			}
		});
	}
}
