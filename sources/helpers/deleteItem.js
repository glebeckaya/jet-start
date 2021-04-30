export default function showConfirmMessage(app, id, data, item, state) {
	if (!data.getItem(id)) return;
	webix.confirm({
		ok: "OK",
		cancel: "Cancel",
		text: `Do you really want remove this ${item}?`
	}).then(() => {
		data.remove(id);
		app.callEvent("onCollectionChange", [state]);
	});
}
