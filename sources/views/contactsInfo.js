import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsInfoView extends JetView {
	config() {
		const contactsTemplate = {
			localId: "temp",
			type: "clean",
			template: `<div class=' webix_template'>
				<div class='custom-row custom-row__header'>#value#</div>
				<div class='custom-row custom-row__main'>
					<div><div class='photo'></div><p>Status: #status#</p></div>
					<div>
						<p><i class="fas fa-envelope"></i> Email: #Email#</p>
						<p><i class="fab fa-skype"></i> Skype: #Skype#</p>
						<p><i class="fas fa-clipboard-list"></i> Job: #Job#</p>
						<p><i class="fas fa-briefcase"></i> Company: #Company#</p>
					</div>
					<div>
						<p><i class="far fa-calendar-alt"></i> Birthday: #Birthday#</p>
						<p><i class="fas fa-street-view"></i> Location: #Address#</p>
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
				{
					cols: [
						contactsTemplate,
						contactsButtons
					]
				},
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
				this.$$("temp").parse(user);
			}
		});
	}
}
