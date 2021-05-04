import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const formButtons = {
			cols: [
				{},
				{
					view: "button",
					css: "webix_primary",
					label: _("Cancel"),
					width: 150,
					click: () => this.showConfirmToCancel()
				},
				{
					view: "button",
					localId: "buttonSave",
					css: "webix_primary",
					width: 150,
					click: () => this.saveContact()
				}
			]
		};

		const contactForm = {
			view: "form",
			localId: "ContactForm",
			elements: [
				{
					cols: [
						{
							padding: 20,
							rows: [
								{
									view: "text",
									label: _("FirstName"),
									name: "FirstName",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "text",
									label: _("LastName"),
									name: "LastName",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "datepicker",
									type: "date",
									label: _("JoiningDate"),
									name: "StartDate",
									format: "%d %M %Y",
									value: new Date(),
									invalidMessage: _("fieldRequired"),
									bottomPadding: 15
								},
								{
									view: "combo",
									label: _("Status"),
									name: "StatusID",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired"),
									suggest: {
										data: statuses,
										body: {template: "#Value#"}
									}
								},
								{
									view: "text",
									label: _("Job"),
									name: "Job",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "text",
									label: _("Company"),
									name: "Company",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "text",
									label: _("Website"),
									name: "Website",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "text",
									label: _("Address"),
									name: "Address",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								}
							]
						},
						{
							padding: 20,
							rows: [
								{
									view: "text",
									label: "Email",
									name: "Email",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									bottomPadding: 15
								},
								{
									view: "text",
									label: _("Phone"),
									name: "Phone",
									bottomPadding: 15,
									invalidMessage: _("fieldRequired")
								},
								{
									view: "datepicker",
									type: "date",
									label: _("Birthday"),
									name: "Birthday",
									format: "%d %M %Y",
									invalidMessage: _("fieldRequired"),
									bottomPadding: 15
								},
								{
									cols: [
										{
											localId: "photoTemplate",
											template: obj => `<div class='photo'><img src=${obj.Photo ||
												"./sources/imgs/user.png"} alt=''></div>`},
										{
											padding: 10,
											rows: [
												{},
												{
													view: "uploader",
													value: _("ChangePhoto"),
													accept: "image/jpeg, image/png",
													autosend: false,
													multiple: false,
													on: {
														onBeforeFileAdd: (upload) => {
															let file = upload.file;
															let reader = new FileReader();
															reader.onload = (event) => {
																this.photoTemplate.parse({Photo: event.target.result});
															};
															reader.readAsDataURL(file);
															return false;
														}
													}
												},
												{
													view: "button",
													css: "webix_primary",
													label: _("DeletePhoto"),
													click: () => this.removePhoto()
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail,
				Company: webix.rules.isNotEmpty,
				Phone: webix.rules.isNotEmpty,
				Birthday: webix.rules.isNotEmpty
			}
		};

		return {
			rows: [
				{localId: "headerForm", template: "#headerForm#", type: "header", height: 40},
				contactForm,
				formButtons
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
		this.form = this.$$("ContactForm");
		this.header = this.$$("headerForm");
		this.buttonSave = this.$$("buttonSave");
		this.photoTemplate = this.$$("photoTemplate");
	}

	urlChange() {
		this.id = this.getParam("id");
		if (contacts.exists(this.id)) {
			const contact = contacts.getItem(this.id);
			this.form.setValues(contact || {});
			this.photoTemplate.setValues(contact);
			this.setLabels("Edit");
		}
		else this.setLabels("Add");
	}

	setLabels(label) {
		const headerForm = this._(`${label}Contact`);
		this.$$("headerForm").setValues({headerForm});
		this.$$("buttonSave").setValue(this._(label));
	}

	saveContact() {
		if (!this.form.validate()) {
			webix.message(this._("checkFields"));
			return false;
		}
		const values = this.form.getValues();
		values.Birthday = webix.Date.dateToStr("%Y-%m-%d %h:%i")(values.Birthday);
		values.Photo = this.photoTemplate.getValues().Photo;

		contacts.waitSave(() => {
			if (values.id) {
				contacts.updateItem(values.id, values);
			}
			else contacts.add(values);
		}).then((res) => {
			this.cancelContactForm(res.id);
		});
		return values;
	}

	showConfirmToCancel() {
		webix.confirm({
			ok: "OK",
			cancel: this._("Cancel"),
			text: this._("CancelFormContact")
		}).then(
			() => this.cancelContactForm()
		);
	}

	cancelContactForm(id) {
		this.app.callEvent("onCancelForm", [id]);
	}

	removePhoto() {
		webix.confirm({
			ok: "OK",
			cancel: this._("Cancel"),
			text: `${this._("wantDelete")} ${this._("photo")}`
		}).then(() => this.photoTemplate.parse({Photo: ""}));
	}
}
