import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let header = {
			type: "header", localId: "header", template: "#headerName#", css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			localId: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: _("Contacts"), id: "contacts", icon: "mdi mdi-account"},
				{value: _("Activities"), id: "activities", icon: "wxi-calendar"},
				{value: _("Settings"), id: "settings", icon: "mdi mdi-cogs"}
			],
			on: {
				onAfterSelect: (id) => {
					const headerName = this.$$("top:menu").getItem(id).value;
					this.$$("header").setValues({headerName});
				}
			}
		};

		let ui = {
			paddingX: 5,
			rows: [
				header,
				{
					cols: [
						menu,
						{
							type: "wide",
							rows: [{$subview: true}]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
