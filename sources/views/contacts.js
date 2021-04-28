import {JetView} from "webix-jet";

import contacts from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [
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
							value: "Add contact",
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
		this.list.sync(contacts);
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id");
			const currentId = contacts.exists(id) ? id : contacts.getFirstId();
			const subView = this.getSubView();
			if ((!subView && currentId) || (subView.getUrlString() === "contactsInfo" && currentId)) {
				this.list.select(currentId);
			}
			if (subView.getUrlString() === "contactsForm") this.list.unselectAll();
		});
	}
}
