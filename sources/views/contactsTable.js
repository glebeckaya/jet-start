import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import activities from "../models/activities";
import contacts from "../models/contacts";
import files from "../models/files";
import ActivityTableView from "./activityTableView";
import PopupView from "./windows/popup";

export default class ContactsTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
							value: _("AddActivity"),
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
							header: _("Name"),
							fillspace: true,
							sort: "text"
						},
						{
							id: "lastModifiedDate",
							header: _("ChangeDate"),
							format: webix.Date.dateToStr("%d %M %Y"),
							sort: "date",
							width: 200
						},
						{
							id: "sizetext",
							header: _("Size"),
							sort: "text"
						},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							showConfirmMessage({
								app: this.app,
								Id: id,
								collection: files,
								text: `${_("wantDelete")} ${_("file")}?`,
								cancel: _("Cancel")
							});
							return false;
						}
					}
				},
				{
					view: "uploader",
					autosend: false,
					value: _("UploadFile"),
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
						{value: _("Activities"), id: "activitiesCell"},
						{value: _("Files"), id: "filesCell"}
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
				this.activitiesTable.queryView({view: "datatable"}).setState({filter: {}});
				activities.filter(obj => obj.ContactID === this.id);
				files.filter(obj => obj.ContactID === this.id);
				this.activitiesTable.queryView({view: "datatable"}).sync(activities);
				this.filesTable.sync(files);
			}
		});
	}
}
