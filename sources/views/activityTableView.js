import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import activities from "../models/activities";
import activitytypes from "../models/activitytypes";
import contacts from "../models/contacts";
import PopupView from "./windows/popup";

const tableLocalID = "tableActivity";

class ActivityTableView extends JetView {
	constructor(app, column) {
		super(app);
		this.contactCol = column;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "datatable",
			localId: tableLocalID,
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
					header: [_("ActivityType"), {
						content: "richSelectFilter",
						inputConfig: {
							suggest: {
								view: "datasuggest",
								width: 500,
								template: obj => `${obj.value || ""}`,
								body: {
									width: 500,
									template: obj => `<span 
									class="fas fa-${activitytypes.getItem(obj.id) ? activitytypes.getItem(obj.id).Icon : "ban"} 
									fa-${activitytypes.getItem(obj.id) ? activitytypes.getItem(obj.id).Icon : "ban"}-alt"></span> 
									${activitytypes.getItem(obj.id) ? activitytypes.getItem(obj.id).Value : ""}`
								}
							}
						}
					}],
					collection: activitytypes,
					template: obj => `<span 
						class="fas fa-${activitytypes.getItem(obj.TypeID) ? activitytypes.getItem(obj.TypeID).Icon : "ban"} 
						fa-${activitytypes.getItem(obj.TypeID) ? activitytypes.getItem(obj.TypeID).Icon : "ban"}-alt"></span> 
						${activitytypes.getItem(obj.TypeID) ? activitytypes.getItem(obj.TypeID).Value : "default"}`,
					sort: "text"
				},
				{
					id: "date",
					format: webix.Date.dateToStr("%d %M %Y"),
					header: [_("DueDate"), {
						content: "dateRangeFilter",
						inputConfig: {format: webix.Date.dateToStr("%d %M %Y")}
					}],
					width: 200,
					sort: "date"
				},
				{
					id: "Details",
					header: [_("Details"), {content: "textFilter"}],
					sort: "string",
					fillspace: true
				},
				{
					id: "ContactID",
					header: [_("Contact"), {content: "selectFilter"}],
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
					showConfirmMessage({
						app: this.app,
						Id: id,
						collection: activities,
						text: `${_("wantDelete")} ${_("activity")}?`,
						cancel: _("Cancel"),
						state: this.table.getState()
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					this.popup.showWindow({title: "Edit", buttonName: "Save", activityId: id});
				}
			}
		};
	}

	init() {
		this.table = this.$$(tableLocalID);
		if (!this.contactCol) this.table.hideColumn("ContactID");
		this.popup = this.ui(PopupView);
		this.on(this.app, "onCollectionChange", (state) => {
			this.table.setState(state);
			this.table.filterByAll();
		});
	}
}

export {ActivityTableView, tableLocalID};
