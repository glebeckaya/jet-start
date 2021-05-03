import {JetView} from "webix-jet";

import activities from "../models/activities";
import contacts from "../models/contacts";
import files from "../models/files";
import statuses from "../models/statuses";

export default class ContactsInfoView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const contactsTemplate = {
			localId: "contactsTemplate",
			type: "clean",
			template: obj => `<div class=' webix_template'>
				<div class='custom-row custom-row__header'>${obj.value || ""}</div>
				<div class='custom-row custom-row__main'>
					<div>
						<div class='photo'>
							<img src= ${obj.Photo || "./sources/imgs/user.png"} alt="">
						</div>
						<p>${_("Status")}: ${obj.status || ""}</p>
					</div>
					<div>
						<p><span class="fas fa-envelope"></span> Email: ${obj.Email || ""}</p>
						<p><span class="fab fa-skype"></span> Skype: ${obj.Skype || ""}</p>
						<p><span class="fas fa-clipboard-list"></span> ${_("Job")}: ${obj.Job || ""}</p>
						<p><span class="fas fa-briefcase"></span> ${_("Company")}: ${obj.Company || ""}</p>
					</div>
					<div>
						<p><span class="far fa-calendar-alt"></span> ${_("Birthday")}: ${obj.Birthday || ""}</p>
						<p><span class="fas fa-street-view"></span> ${_("Location")}: ${obj.Address || ""}</p>
					</div>
				</div>
			</div>`
		};

		const contactsButtons = {
			rows: [
				{
					padding: 10,
					cols: [
						{
							view: "button",
							css: "webix_primary",
							type: "icon",
							label: _("Delete"),
							icon: "far fa-trash-alt",
							width: 150,
							click: () => this.removeContact(this.id)
						},
						{
							view: "button",
							css: "webix_primary",
							type: "icon",
							label: _("Edit"),
							icon: "far fa-edit",
							width: 150,
							click: () => this.show(`contactsForm?id=${this.id}`)
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{cols: [contactsTemplate, contactsButtons]},
				{$subview: "contactsTable"}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			this.id = this.getParam("id", true);

			if (contacts.exists(this.id)) {
				const user = contacts.getItem(this.id);
				const icon = statuses.getItem(user.StatusID).Icon;
				const status = statuses.getItem(user.StatusID).Value;
				user.status = `${status} <span class="fas fa-${icon} fa-${icon}-alt"></span>`;
				this.$$("contactsTemplate").parse(user);
			}
		});
	}

	removeContact(id) {
		if (!contacts.getItem(id)) return;
		webix.confirm({
			ok: "OK",
			cancel: "Cancel",
			text: "Do you really want remove this contact?"
		}).then(() => {
			this.removeItemsById(activities, id);
			this.removeItemsById(files, id);
			contacts.remove(id);
			this.app.callEvent("onCancelForm");
		});
	}

	removeItemsById(collection, contact) {
		const items = collection.find(obj => obj.ContactID === contact);
		items.forEach(item => collection.remove(item.id));
	}
}
