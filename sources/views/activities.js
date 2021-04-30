import {JetView} from "webix-jet";

import ActivityTableView from "./activityTableView";
import PopupView from "./windows/popup";

export default class DataView extends JetView {
	config() {
		const tableActivity = {
			cols: [new ActivityTableView(this.app, true)],
			localId: "tableActivity"
		};

		return {
			rows: [
				{
					cols: [
						{},
						{
							view: "button",
							value: "Add activity",
							css: "webix_primary",
							width: 200,
							click: () => this.popup.showWindow({title: "Add", buttonName: "Add"})
						}
					]
				},
				tableActivity
			]
		};
	}

	init() {
		this.popup = this.ui(PopupView);
	}
}
