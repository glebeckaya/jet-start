const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			let parserDate = webix.Date.strToDate("%Y-%M-%d");
			let parserTime = webix.Date.strToDate("%H:%i");
			obj.date = parserDate(obj.DueDate);
			obj.time = parserTime(obj.DueDate);
		}
	}
});
export default activities;
