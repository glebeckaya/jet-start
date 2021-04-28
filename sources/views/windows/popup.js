import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activitytypes from "../../models/activitytypes";
import contacts from "../../models/contacts";

const parserDate = webix.Date.dateToStr("%Y-%m-%d");
const parserTime = webix.Date.dateToStr("%H:%i");

export default class PopupView extends JetView {
	config() {
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
						view: "textarea",
						name: "Details",
						label: "Details",
						height: 120,
						bottomPadding: 15,
						invalidMessage: "This field is required"
					},
					{
						view: "combo",
						label: "Type",
						name: "TypeID",
						bottomPadding: 15,
						invalidMessage: "This field is required",
						options: activitytypes
					},
					{
						view: "combo",
						label: "Contact",
						name: "ContactID",
						readonly: false,
						bottomPadding: 15,
						invalidMessage: "This field is required",
						options: contacts
					},
					{
						cols: [
							{
								view: "datepicker",
								type: "date",
								label: "Date",
								name: "date",
								format: "%d %M %Y",
								invalidMessage: "This field is required",
								bottomPadding: 15
							},
							{
								view: "datepicker",
								type: "time",
								label: "Time",
								name: "time",
								format: "%H:%i",
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
							{view: "button", localId: "buttonSave", width: 100, click: () => this.saveActivity()},
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

	showWindow(options) {
		const contact = this.getParam("id", true);
		if (options.activityId) {
			this.values = activities.getItem(options.activityId);
			this.form.setValues(this.values || {});
		}
		else {
			this.form.setValues({ContactID: contacts.getItem(contact)});
		}
		this.form.elements.ContactID.config.readonly = options.readonly || false;
		const headerWindow = `${options.title} activity`;
		this.$$("headerWindow").setValues({headerWindow});
		this.$$("buttonSave").setValue(options.buttonName);
		this.getRoot().show();
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
		values.date = parserDate(values.date);
		values.time = parserTime(values.time);
		values.DueDate = `${values.date} ${values.time}`;

		activities.waitSave(() => {
			if (values.id) {
				activities.updateItem(values.id, values);
			}
			else activities.add(values);
		}).then(() => {
			this.hideWindow();
		});

		return values;
	}
}
