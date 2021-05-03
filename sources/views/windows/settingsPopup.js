import {JetView} from "webix-jet";

export default class SettingsPopupView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			modal: true,
			position: "center",
			width: 800,
			head: {
				cols: [
					{localId: "headerWindow", template: "#headerWindow#", type: "header"},
					{view: "icon", icon: "wxi-close", click: () => this.hideWindow()}
				]
			},
			body: {
				view: "form",
				localId: "form",
				elements: [
					{
						view: "text",
						name: "Value",
						label: _("Name"),
						bottomPadding: 20,
						invalidMessage: _("fieldRequired")
					},
					{
						view: "richselect",
						name: "Icon",
						label: _("Icon"),
						bottomPadding: 20,
						invalidMessage: _("fieldRequired"),
						options: {
							view: "datasuggest",
							body: {
								template: obj => `<span class="fas fa-${obj.value} fa-${obj.value}-alt"></span>`,
								type: {width: 50, height: 50},
								data: [
									"pencil", "flag", "comment", "clock",
									"bell", "ban", "cogs", "plus", "phone",
									"glass-martini", "user"
								]
							}
						}
					},
					{
						cols: [
							{},
							{view: "button", localId: "buttonSave", width: 100, click: () => this.save()},
							{view: "button", label: _("Cancel"), width: 100, click: () => this.hideWindow()}
						]
					}
				],
				rules: {
					Value: webix.rules.isNotEmpty,
					Icon: webix.rules.isNotEmpty
				}
			}
		};
	}

	init() {
		this.form = this.$$("form");
		this._ = this.app.getService("locale")._;
	}

	showWindow(options) {
		this.collection = options.collection;
		this.type = options.type;
		if (options.Id) {
			this.values = this.collection.getItem(options.Id);
			this.form.setValues(this.values || {});
		}
		const headerWindow = this._(`${options.title}`);
		this.$$("headerWindow").setValues({headerWindow});
		this.$$("buttonSave").setValue(this._(options.buttonName));
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	save() {
		if (!this.form.validate()) {
			webix.message(this._("checkFields"));
			return false;
		}
		const values = this.form.getValues();

		this.collection.waitSave(() => {
			if (values.id) {
				this.collection.updateItem(values.id, values);
			}
			else this.collection.add(values);
		}).then(() => {
			this.hideWindow();
			webix.message(this._(`${this.type}WasSaved`));
		});

		return values;
	}
}
