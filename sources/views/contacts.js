import {JetView} from "webix-jet";

import contacts from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				{
					view: "list",
					localId: "contactsList",
					width: 300,
					css: "contacts-list",
					type: {
						template: obj => `<div class='photo'><img src=${obj.Photo || "./sources/imgs/user.png"} alt=""></div>
								<div><p>${obj.FirstName} ${obj.LastName}</p><p>${obj.Company}</p></div>`,
						height: 65
					},
					scroll: "y",
					select: true,
					on: {
						onAfterSelect: id => this.setParam("id", id, true)
					}
				},
				{$subview: "contactsInfo"}
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
			if (currentId) {
				this.list.select(currentId);
			}
		});
	}
}
