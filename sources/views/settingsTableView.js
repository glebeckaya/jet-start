import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";
import SettingsPopupView from "./windows/settingsPopup";

export default class SettingsTableView extends JetView {
	constructor(app, collection, header) {
		super(app);
		this.collection = collection;
		this.header = header;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							value: _(`Add${this.header}`),
							autowidth: true,
							css: "webix_primary",
							click: () => {
								this.popup.showWindow({
									title: `Add${this.header}`,
									buttonName: "Add",
									collection: this.collection,
									type: this.header
								});
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "settingsTable",
					columns: [
						{
							id: "Icon",
							header: _("Icon"),
							width: 70,
							template: obj => `<span class="fas fa-${obj.Icon} fa-${obj.Icon}-alt"></span>`
						},
						{
							id: "Value",
							header: _(this.header),
							fillspace: true,
							sort: "text"
						},
						{
							id: "edit",
							header: "",
							template: "{common.editIcon()}",
							width: 50
						},
						{
							id: "del",
							header: "",
							template: "{common.trashIcon()}",
							width: 50
						}
					],
					rules: {
						Value: webix.rules.isNotEmpty
					},
					onClick: {
						"wxi-trash": (e, id) => {
							showConfirmMessage({
								app: this.app,
								Id: id,
								collection: this.collection,
								text: `${_("wantDelete")} ${_(this.header)}?`,
								cancel: _("Cancel")
							});
							return false;
						},
						"wxi-pencil": (e, id) => {
							this.popup.showWindow({
								Id: id,
								title: `Edit${this.header}`,
								buttonName: "Save",
								collection: this.collection,
								type: this.header
							});
						}
					}
				}
			]
		};
	}

	init() {
		this.settingsTable = this.$$("settingsTable");
		this.settingsTable.sync(this.collection);
		this.popup = this.ui(SettingsPopupView);
	}
}
