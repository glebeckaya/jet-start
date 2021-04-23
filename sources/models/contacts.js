const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			if (!obj.Photo) obj.Photo = "./sources/imgs/user.png";
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		}
	}
});

export default contacts;
