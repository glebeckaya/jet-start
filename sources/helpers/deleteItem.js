export default function showConfirmMessage(id, data, item) {
	if (!data.getItem(id)) return;
	webix.confirm({
		ok: "OK",
		cancel: "Cancel",
		text: `Do you really want remove this ${item}?`
	}).then(
		() => data.remove(id)
	);
}
