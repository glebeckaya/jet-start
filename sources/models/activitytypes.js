const activitytypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: (obj) => { obj.value = obj.Value; },
		$update: (obj) => { obj.value = obj.Value; }
	}
});

export default activitytypes;
