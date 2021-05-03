import {JetView} from "webix-jet";

import activities from "../models/activities";
import ActivityTableView from "./activityTableView";
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
							click: () => this.filterActivities()
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

	urlChange() {
		activities.filter();
		this.tableActivity.queryView({view: "datatable"}).sync(activities);
	}

	filterActivities() {
		const value = this.segmentedButton.getValue();
		const today = new Date();
		const month = today.getMonth();
		const year = today.getFullYear();
		const dayOfMonth = today.getDate();
		const dayOfWeek = today.getDay();

		this.throwOffFilters();
		if (value === "overdue") {
			activities.filter(obj => obj.State === "Open" && obj.date < today);
		}
		if (value === "completed") {
			activities.filter(obj => obj.State === "Close");
		}
		if (value === "today") {
			const endDate = new Date(year, month, dayOfMonth + 1);
			this.tableActivity.queryView({view: "datatable"}).setState({filter: {date: {start: today, end: endDate}}});
		}
		if (value === "tomorrow") {
			const endDate = new Date(year, month, dayOfMonth + 2);
			const startDate = new Date(year, month, dayOfMonth + 1);
			this.tableActivity.queryView({view: "datatable"}).setState({filter: {date: {start: startDate, end: endDate}}});
		}
		if (value === "thisweek") {
			const startDate = new Date(year, month, dayOfMonth - (dayOfWeek - 1));
			const endDate = new Date(year, month, dayOfMonth + (7 - dayOfWeek));
			this.tableActivity.queryView({view: "datatable"}).setState({filter: {date: {start: startDate, end: endDate}}});
		}
		if (value === "thismonth") {
			const startDate = new Date(year, month, 1);
			const endDate = new Date(year, month + 1, 0);
			this.tableActivity.queryView({view: "datatable"}).setState({filter: {date: {start: startDate, end: endDate}}});
		}
	}

	throwOffFilters() {
		this.tableActivity.queryView({view: "datatable"}).setState({filter: {}});
		activities.filter();
	}
}
