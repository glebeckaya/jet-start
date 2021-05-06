export default function showConfirmMessage(options) {
	if (!options.collection.getItem(options.Id)) return;
	webix.confirm({
		ok: "OK",
		cancel: options.cancel,
		text: options.text
	}).then(() => {
		options.collection.remove(options.Id);
		options.app.callEvent("onCollectionChange", [options.state]);
	});
}
