import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import activities from "../models/activities";
import activitytypes from "../models/activitytypes";
import contacts from "../models/contacts";
import PopupView from "./windows/popup";

export default class ActivityTableView extends JetView {
	constructor(app, column) {
		super(app);
		this.contactCol = column;
	}

	config() {
		return {
			view: "datatable",
			localId: "tableActivity",
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
					header: ["Activity Type", {content: "selectFilter"}],
					collection: activitytypes,
					sort: "text"
				},
				{
					id: "date",
					format: webix.Date.dateToStr("%d %M %Y"),
					header: ["Due Date", {
						content: "dateRangeFilter",
						inputConfig: {format: webix.Date.dateToStr("%d %M %Y")}
					}],
					width: 200,
					sort: "date"
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					sort: "string",
					fillspace: true
				},
				{
					id: "ContactID",
					header: ["Contact", {content: "selectFilter"}],
					collection: contacts,
					sort: "string",
					fillspace: true
				},
				{id: "edit", header: "", template: "{common.editIcon()}", width: 50},
				{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
			],
			css: "webix_shadow_medium",
			select: true,
			onClick: {
				"wxi-trash": (e, id) => {
					const state = this.table.getState();
					showConfirmMessage(this.app, id, activities, "activity", state);
					return false;
				},
				"wxi-pencil": (e, id) => {
					this.popup.showWindow({title: "Edit", buttonName: "Save", activityId: id});
				}
			}
		};
	}

	init() {
		this.table = this.$$("tableActivity");
		activities.filter();
		this.table.sync(activities);
		if (!this.contactCol) this.table.hideColumn("ContactID");
		this.popup = this.ui(PopupView);
		this.on(this.app, "onCollectionChange", (state) => {
			this.table.setState(state);
			this.table.filterByAll();
		});
	}
}
