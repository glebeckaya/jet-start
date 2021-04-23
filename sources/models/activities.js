const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			let parser = webix.Date.strToDate("%Y-%m-%d %H:%i");
			obj.date = parser(obj.DueDate);
			obj.time = parser(obj.DueDate);
		},
		$update: (obj) => {
			let parser = webix.Date.strToDate("%Y-%m-%d %H:%i");
			obj.date = parser(obj.DueDate);
			obj.time = parser(obj.DueDate);
		}
	}
});
export default activities;

