import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsInfoView extends JetView {
	config() {
		return {
			view: "template",
			localId: "temp"
		};
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id", true);
			if (contacts.exists(id)) {
				const user = contacts.getItem(id);
				this.$$("temp").$view.innerHTML = `<div class=' webix_template'>
					<div class='custom-row custom-row__header'>${user.value}
						<div>
							<button type="button" class="webix_button custom-button"><i class="far fa-trash-alt"></i> Delete</button>
							<button type="button" class="webix_button custom-button"><i class="far fa-edit"></i> Edit</button>
						</div>
					</div>
					<div class='custom-row custom-row__main'>
						<div><div class='photo'></div><p>Status: ${statuses.getItem(user.StatusID).Value}</p></div>
						<div>
							<p><i class="fas fa-envelope"></i> Email: ${user.Email}</p>
							<p><i class="fab fa-skype"></i> Skype: ${user.Skype}</p>
							<p><i class="fas fa-clipboard-list"></i> Job: ${user.Job}</p>
							<p><i class="fas fa-briefcase"></i> Company: ${user.Company}</p>
						</div>
						<div>
							<p><i class="far fa-calendar-alt"></i> Birthday: ${user.Birthday}</p>
							<p><i class="fas fa-street-view"></i> Location: ${user.Address}</p>
						</div>
					</div>
				</div>`;
			}
		});
	}
}
