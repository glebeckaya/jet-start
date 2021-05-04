import {JetView} from "webix-jet";

import showConfirmMessage from "../helpers/deleteItem";

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
							click: () => this.addItem()
						}
					]
				},
				{
					view: "datatable",
					localId: "settingsTable",
					editable: true,
					columns: [
						{
							id: "Icon",
							header: _("Icon"),
							width: 70,
							template: obj => `<span class="fas fa-${obj.Icon} fa-${obj.Icon}-alt"></span>`,
							editor: "richselect",
							popup: {
								view: "datasuggest",
								body: {
									type: {
										height: 50,
										width: 50
									},
									template: obj => `<span class="fas fa-${obj.value} fa-${obj.value}-alt"></span>`
								}
							},
							options: [
								"pencil", "flag", "comment", "clock",
								"bell", "ban", "cogs", "plus", "phone",
								"glass-martini", "user"
							]
						},
						{
							id: "Value",
							header: _(this.header),
							fillspace: true,
							editor: "text",
							sort: "text"
						},
						{
							id: "del",
							header: "",
							template: "{common.trashIcon()}",
							width: 50
						}
					],
					on: {
						onBeforeEditStop: (state, editor, ignore) => {
							const check = (editor.getValue() !== "");
							if (!ignore && !check) {
								webix.message(_("fieldRequired"));
								return false;
							}
							return true;
						}
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
						}
					}
				}
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
		this.settingsTable = this.$$("settingsTable");
		this.settingsTable.sync(this.collection);
	}

	addItem() {
		this.collection.waitSave(() => {
			this.collection.add({Value: "default", Icon: "ban"});
		}).then(() => {
			webix.message(this._(`${this.header}WasSaved`));
		});
	}
}
