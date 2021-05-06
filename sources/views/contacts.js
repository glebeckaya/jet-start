import {JetView} from "webix-jet";

import contacts from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			cols: [
				{
					rows: [
						{
							view: "text",
							localId: "filterView",
							placeholder: _("TypeContact"),
							on: {
								onTimedKeyPress: () => this.filterContacts()
							}
						},
						{
							view: "list",
							localId: "contactsList",
							width: 300,
							css: "contacts-list",
							type: {
								template: obj => `<div class='photo'>
													<img src=${obj.Photo || "./sources/imgs/user.png"} alt="">
												</div>
												<div>
													<p>${obj.FirstName} ${obj.LastName}</p>
													<p>${obj.Company}</p>
												</div>`,
								height: 65
							},
							scroll: "y",
							select: true,
							on: {
								onAfterSelect: (id) => {
									this.setParam("id", id, true);
									this.show("./contactsInfo");
								}
							}
						},
						{
							view: "button",
							value: _("AddContact"),
							css: "webix_primary",
							click: () => this.show("./contactsForm")
						}
					]
				},
				{$subview: true}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.filter = this.$$("filterView");
		this.list.sync(contacts);
		this.on(this.app, "onCancelForm", (id) => {
			if (contacts.exists(id)) {
				this.show(`../contacts?id=${id}/contactsInfo`);
			}
			else {
				this.show(`../contacts?id=${contacts.getFirstId()}/contactsInfo`);
			}
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id");
			const currentId = contacts.exists(id) ? id : contacts.getFirstId();
			const subView = this.getSubView();
			if (subView) {
				const nameSubView = subView.getUrlString();
				if (nameSubView === "contactsInfo" && currentId) this.list.select(currentId);
				if (nameSubView === "contactsForm") this.list.unselectAll();
			}
			else this.list.select(currentId);
		});
		contacts.filter();
	}

	filterContacts() {
		const value = this.filter.getValue().toLowerCase();
		contacts.filter(obj => obj.value.toLowerCase().indexOf(value) !== -1 ||
		obj.Email.toLowerCase().indexOf(value) !== -1 ||
		obj.Skype.toLowerCase().indexOf(value) !== -1 ||
		obj.Job.toLowerCase().indexOf(value) !== -1 ||
		obj.Company.toLowerCase().indexOf(value) !== -1);
	}
}
