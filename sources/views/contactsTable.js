import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import activities from "../models/activities";
import contacts from "../models/contacts";
import files from "../models/files";
import ActivityTableView from "./activityTableView";
import PopupView from "./windows/popup";

export default class ContactsTableView extends JetView {
	config() {
		const tableActivity = {
			cols: [new ActivityTableView(this.app, false)],
			localId: "activities"
		};

		const activitiesTable = {
			id: "activitiesCell",
			rows: [
				tableActivity,
				{
					cols: [
						{},
						{
							view: "button",
							value: "Add activity",
							css: "webix_primary",
							width: 200,
							click: () => {
								this.state = this.activitiesTable.queryView({view: "datatable"}).getState();
								this.popup.showWindow({readonly: true, title: "Add", buttonName: "Add"});
							}
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
							showConfirmMessage(this.app, id, files, "file");
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
							upload.ContactID = this.id;
						},
						onAfterFileAdd: () => {
							files.filter(obj => obj.ContactID === this.id);
							this.filesTable.sync(files);
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
			files.waitData
		]).then(() => {
			this.id = parseInt(this.getParam("id", true));
			if (contacts.exists(this.id)) {
				activities.filter(obj => obj.ContactID === this.id);
				files.filter(obj => obj.ContactID === this.id);
				this.activitiesTable.sync(activities);
				this.filesTable.sync(files);
			}
		});
	}
}
