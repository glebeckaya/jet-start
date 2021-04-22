import {JetView} from "webix-jet";

export default class PopupView extends JetView {
	constructor(app, title, action, dataActivities, dataActivityTypes, dataContacts) {
		super(app);
		this.title = title;
		this.action = action;
		this.dataActivities = dataActivities;
		this.dataActivityTypes = dataActivityTypes;
		this.dataContacts = dataContacts;
	}

	config() {
		return {
			view: "window",
			position: "center",
			width: 800,
			move: true,
			head: `${this.title} activity`,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{view: "textarea", name: "Details", label: "Details", height: 120, bottomPadding: 15, invalidMessage: "This field is required"},
					{
						view: "combo",
						label: "Type",
						name: "TypeID",
						bottomPadding: 15,
						invalidMessage: "This field is required",
						suggest: {
							data: this.dataActivityTypes,
							template: "#Value#",
							body: {template: "#Value#"}
						}
					},
					{
						view: "combo",
						label: "Contact",
						name: "ContactID",
						bottomPadding: 15,
						invalidMessage: "This field is required",
						options: this.dataContacts
					},
					{
						cols: [
							{
								view: "datepicker",
								type: "date",
								label: "Date",
								name: "date",
								format: webix.Date.dateToStr("%d %M %Y"),
								stringResult: true,
								invalidMessage: "This field is required",
								bottomPadding: 15
							},
							{
								view: "datepicker",
								type: "time",
								label: "Time",
								name: "time",
								stringResult: true,
								invalidMessage: "This field is required",
								bottomPadding: 15
							}
						]
					},
					{
						view: "checkbox",
						label: "Completed",
						name: "State",
						uncheckValue: "Open",
						checkValue: "Close"
					},
					{
						cols: [
							{},
							{view: "button", label: this.action, width: 100, click: () => this.saveActivity()},
							{view: "button", label: "Cancel", width: 100, click: () => this.hideWindow()}
						]
					}
				],
				rules: {
					Details: webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
					date: webix.rules.isNotEmpty,
					time: webix.rules.isNotEmpty
				}
			}
		};
	}

	init() {
		this.form = this.$$("form");
	}

	showWindow(id) {
		this.getRoot().show();
		this.values = this.dataActivities.getItem(id);
		if (this.values) this.form.setValues(this.values);
	}

	hideWindow() {
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	saveActivity() {
		if (!this.form.validate()) {
			webix.message("Please, check all fields!");
			return false;
		}
		const values = this.form.getValues();
		values.DueDate = `${values.date.split(" ")[0]} ${values.time}`;

		let parser = webix.Date.dateToStr("%Y-%m-%d %H:%i");
		values.DueDate = parser(values.DueDate);

		if (values.id) {
			this.dataActivities.updateItem(values.id, values);
			this.hideWindow();
		}
		else {
			this.dataActivities.waitSave(() => {
				this.dataActivities.add(values);
			}).then(() => {
				this.hideWindow();
			});
		}
		return values;
	}
}
