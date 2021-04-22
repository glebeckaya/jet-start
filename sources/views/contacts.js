import {JetView} from "webix-jet";

import contacts from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				{
					view: "list",
					localId: "list",
					width: 300,
					css: "contacts-list",
					type: {
						template: `<div class='webix_icon wxi-user'></div>
								<div><p>#FirstName# #LastName#</p><p>#Company#</p></div>`,
						height: 65
					},
					scroll: "y",
					select: true,
					onClick: {
						"wxi-trash": (e, id) => {
							this.deleteItem(id);
							return false;
						}
					}
				},
				{$subview: "contactsInfo"}
			]
		};
	}

	init() {
		this.list = this.$$("list");
		this.list.sync(contacts);
		this.on(this.list, "onAfterSelect", id => this.setParam("id", id, true));
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id");
			const currentId = (contacts.exists(id)) ? id : contacts.getFirstId();
			if (currentId) {
				this.list.select(currentId);
			}
		});
	}
}
