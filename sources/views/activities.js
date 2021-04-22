import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitytypes from "../models/activitytypes";
import contacts from "../models/contacts";
import PopupView from "./windows/popup";

export default class DataView extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							value: "Add activity",
							css: "webix_primary",
							width: 200,
							click: () => this.addForm.showWindow()
						}
					]
				},
				{
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
							template(obj, common, val) {
								if (val && val !== " ") {
									return activitytypes.getItem(val).Value;
								}
								return " ";
							},
							sort: "text"
						},
						{
							id: "date",
							format: webix.Date.dateToStr("%d %M %Y"),
							header: ["Due Date", {content: "dateRangeFilter", inputConfig: {format: webix.Date.dateToStr("%d %M %Y")}}],
							width: 200,
							sort: "date"
						},
						{id: "Details", header: ["Details", {content: "textFilter"}], sort: "string", fillspace: true},
						{
							id: "ContactID",
							header: ["Contact", {content: "selectFilter"}],
							collection: contacts,
							template(obj, common, val) {
								return contacts.getItem(val).value;
							},
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
							this.showConfirmMessage(id);
							return false;
						},
						"wxi-pencil": (e, id) => {
							this.editForm.showWindow(id);
						}
					}
				}
			]
		};
	}

	init() {
		this.table = this.$$("tableActivity");
		webix.promise.all([contacts.waitData, activities.waitData, activitytypes.waitData]).then(() => {
			this.table.sync(activities);
			this.editForm = this.ui(new PopupView(this.app, "Edit", "Save", activities, activitytypes, contacts));
			this.addForm = this.ui(new PopupView(this.app, "Add", "Add", activities, activitytypes, contacts));
		});
	}

	showConfirmMessage(id) {
		if (!activities.getItem(id)) return;
		webix.confirm({
			ok: "OK",
			cancel: "Cancel",
			text: "Do you really want remove this activity?"
		}).then(
			() => activities.remove(id)
		);
	}
}
