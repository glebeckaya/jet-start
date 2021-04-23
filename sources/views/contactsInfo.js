import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsInfoView extends JetView {
	config() {
		const contactsTemplate = {
			localId: "contactsTemplate",
			type: "clean",
			template: obj => `<div class=' webix_template'>
				<div class='custom-row custom-row__header'>${obj.value || ""}</div>
				<div class='custom-row custom-row__main'>
					<div><div class='photo'><img src= ${obj.Photo || "./sources/imgs/user.png"} alt=""></div><p>Status: ${obj.status || ""}</p></div>
					<div>
						<p><span class="fas fa-envelope"></span> Email: ${obj.Email || ""}</p>
						<p><span class="fab fa-skype"></span> Skype: ${obj.Skype || ""}</p>
						<p><span class="fas fa-clipboard-list"></span> Job: ${obj.Job || ""}</p>
						<p><span class="fas fa-briefcase"></span> Company: ${obj.Company || ""}</p>
					</div>
					<div>
						<p><span class="far fa-calendar-alt"></span> Birthday: ${obj.Birthday || ""}</p>
						<p><span class="fas fa-street-view"></span> Location: ${obj.Address || ""}</p>
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
							label: "Delete",
							icon: "far fa-trash-alt",
							width: 150
						},
						{
							view: "button",
							css: "webix_primary",
							type: "icon",
							label: "Edit",
							icon: "far fa-edit",
							width: 150
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{cols: [contactsTemplate, contactsButtons]},
				{}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (contacts.exists(id)) {
				const user = contacts.getItem(id);
				user.status = statuses.getItem(user.StatusID).Value;
				this.$$("contactsTemplate").parse(user);
			}
		});
	}
}
