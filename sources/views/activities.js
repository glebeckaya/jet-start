import {JetView} from "webix-jet";

import activities from "../models/activities";
import {ActivityTableView, tableLocalID} from "./activityTableView";
import PopupView from "./windows/popup";

export default class DataView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const tableActivity = {
			cols: [new ActivityTableView(this.app, true)],
			localId: "tableActivity"
		};

		return {
			rows: [
				{
					cols: [
						{
							view: "segmented",
							localId: "segmentedButton",
							options: [
								{id: "all", value: _("All")},
								{id: "overdue", value: _("Overdue")},
								{id: "completed", value: _("Completed")},
								{id: "today", value: _("Today")},
								{id: "tomorrow", value: _("Tomorrow")},
								{id: "thisweek", value: _("ThisWeek")},
								{id: "thismonth", value: _("ThisMonth")}
							],
							on: {
								onChange: () => this.tableActivity.queryView({localId: tableLocalID}).filterByAll()
							}
						},
						{
							view: "button",
							value: _("AddActivity"),
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
		this.segmentedButton = this.$$("segmentedButton");
		this.tableActivity = this.$$("tableActivity");
	}

	ready() {
		activities.filter();
		this.tableActivity.queryView({localId: tableLocalID}).sync(activities);

		this.tableActivity.queryView({localId: tableLocalID}).registerFilter(
			this.$$("segmentedButton"),
			{
				columnId: "any",
				compare: (cellValue, filterValue, obj) => {
					const today = new Date();
					const month = today.getMonth();
					const year = today.getFullYear();
					const dayOfMonth = today.getDate();
					const dayOfWeek = today.getDay();
					if (filterValue === "overdue") {
						return obj.State === "Open" && obj.date < today;
					}
					if (filterValue === "completed") {
						return obj.State === "Close";
					}
					if (filterValue === "today") {
						const endDate = new Date(year, month, dayOfMonth + 1);
						return obj.date > today && obj.date < endDate;
					}
					if (filterValue === "tomorrow") {
						const endDate = new Date(year, month, dayOfMonth + 2);
						const startDate = new Date(year, month, dayOfMonth + 1);
						return obj.date > startDate && obj.date < endDate;
					}
					if (filterValue === "thisweek") {
						const startDate = new Date(year, month, dayOfMonth - (dayOfWeek - 1));
						const endDate = new Date(year, month, dayOfMonth + (7 - dayOfWeek));
						return obj.date > startDate && obj.date < endDate;
					}
					if (filterValue === "thismonth") {
						const startDate = new Date(year, month, 1);
						const endDate = new Date(year, month + 1, 0);
						return obj.date > startDate && obj.date < endDate;
					}
					return filterValue || obj;
				}
			},
			{
				getValue: segmentedButton => segmentedButton.getValue()
			}
		);
	}
}
