import {JetView} from "webix-jet";

import activitytypes from "../models/activitytypes";
import statuses from "../models/statuses";
import SettingsTableView from "./settingsTableView";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		const activitytypeTable = {
			id: "activitytypesCell",
			rows: [new SettingsTableView(this.app, activitytypes, "ActivityType")]
		};

		const statusesTable = {
			id: "statusesCell",
			rows: [new SettingsTableView(this.app, statuses, "Status")]
		};

		return {
			rows: [
				{
					padding: 20,
					cols: [
						{
							view: "segmented",
							localId: "segmented",
							label: _("Language"),
							inputWidth: 250,
							options: [
								{id: "en", value: "EN"},
								{id: "ru", value: "RU"}
							],
							click: () => this.toggleLanguage(),
							value: lang
						}
					]
				},
				{
					view: "tabbar",
					localId: "tabbar",
					multiview: true,
					options: [
						{value: _("ActivityTypes"), id: "activitytypesCell"},
						{value: _("Statuses"), id: "statusesCell"}
					]
				},
				{
					view: "multiview",
					cells: [activitytypeTable, statusesTable]
				}
			]
		};
	}

	toggleLanguage() {
		const value = this.$$("segmented").getValue();
		const langs = this.app.getService("locale");
		webix.i18n.setLocale(`${value}-${value.toUpperCase()}`);
		langs.setLang(value);
	}
}
