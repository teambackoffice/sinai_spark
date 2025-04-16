frappe.listview_settings["Business Proposal"] = {
	get_indicator: function (doc) {
		if (doc.status === "Paid") {
			
			return [__("Paid"), "green", "status,=,Paid"];
		}
		
		else if (doc.status === "Partially Paid") {
			return [__("Partially Paid"), "red", "status,=,Partially Paid"];
		} 
		
	},
}