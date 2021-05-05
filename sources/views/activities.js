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
		this.tableActivityInner = this.getInnerTable();
		if (this.tableActivityInner) {
			this.tableActivityInner.sync(activities);
			this.tableActivityInner.registerFilter(
				this.$$("segmentedButton"),
				{
					columnId: "any",
					compare: (cellValue, filterValue, obj) => {
						const today = new Date();
						const month = today.getMonth();
						const year = today.getFullYear();
						const dayOfMonth = today.getDate();
						const dayOfWeek = today.getDay();
						const todayDay = {start: today, end: new Date(year, month, dayOfMonth + 1)};
						const tomorrow = {
							start: new Date(year, month, dayOfMonth + 1),
							end: new Date(year, month, dayOfMonth + 2)
						};
						const thisweek = {
							start: new Date(year, month, dayOfMonth - (dayOfWeek - 1)),
							end: new Date(year, month, dayOfMonth + (7 - dayOfWeek))
						};
						const thismonth = {
							start: new Date(year, month, 1),
							end: new Date(year, month + 1, 0)
						};
						switch (filterValue) {
							case "overdue":
								return obj.State === "Open" && obj.date < today;
							case "completed":
								return obj.State === "Close";
							case "today":
								return obj.date > todayDay.start && obj.date < todayDay.end;
							case "tomorrow":
								return obj.date > tomorrow.start && obj.date < tomorrow.end;
							case "thisweek":
								return obj.date > thisweek.start && obj.date < thisweek.end;
							case "thismonth":
								return obj.date > thismonth.start && obj.date < thismonth.end;
							default:
								return filterValue || obj;
						}
					}
				},
				{
					getValue: segmentedButton => segmentedButton.getValue()
				}
			);
		}
	}

	getInnerTable() {
		return this.tableActivity.queryView({localId: tableLocalID});
	}
}
