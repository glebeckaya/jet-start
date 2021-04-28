import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const formButtons = {
			cols: [
				{},
				{
					view: "button",
					css: "webix_primary",
					label: "Cancel",
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
									label: "First name",
									name: "FirstName",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "datepicker",
									type: "date",
									label: "Joining date",
									name: "StartDate",
									format: "%d %M %Y",
									value: new Date(),
									invalidMessage: "This field is required",
									bottomPadding: 15
								},
								{
									view: "combo",
									label: "Status",
									name: "StatusID",
									bottomPadding: 15,
									invalidMessage: "This field is required",
									suggest: {
										data: statuses,
										body: {template: "#Value#"}
									}
								},
								{
									view: "text",
									label: "Job",
									name: "Job",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "text",
									label: "Company",
									name: "Company",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "text",
									label: "Website",
									name: "Website",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "text",
									label: "Address",
									name: "Address",
									bottomPadding: 15,
									invalidMessage: "This field is required"
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
									invalidMessage: "This field is required"
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									bottomPadding: 15
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone",
									bottomPadding: 15,
									invalidMessage: "This field is required"
								},
								{
									view: "datepicker",
									type: "date",
									label: "Birthday",
									name: "Birthday",
									format: "%d %M %Y",
									invalidMessage: "This field is required",
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
													value: "Change photo",
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
													label: "Delete photo",
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
		const headerForm = `${label} contact`;
		this.$$("headerForm").setValues({headerForm});
		this.$$("buttonSave").setValue(label);
	}

	saveContact() {
		if (!this.form.validate()) {
			webix.message("Please, check all fields!");
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
			cancel: "Cancel",
			text: "Do you really want cancel this form?"
		}).then(
			() => this.cancelContactForm()
		);
	}

	cancelContactForm(id) {
		if (contacts.exists(id)) {
			this.show(`/top/contacts?id=${id}/contactsInfo`);
		}
		else {
			this.show(`/top/contacts?id=${contacts.getFirstId()}/contactsInfo`);
		}
	}

	removePhoto() {
		webix.confirm({
			ok: "OK",
			cancel: "Cancel",
			text: "Do you really want delete photo?"
		}).then(() => this.photoTemplate.parse({Photo: ""}));
	}
}
