
frappe.ui.form.on("Business Proposal", {
	refresh: function(frm) {
         
        if (!frm.is_new()) {
            if (frm.doc.status === "Completed") {
                frm.fields_dict['business_proposal_item'].grid.wrapper.find('.grid-add-row').hide();

                frm.page.set_secondary_action(__('Document Receiving'), function() {
                    frappe.new_doc('Document Receiving', {
                        business_proposal__id: frm.doc.name,
                        customer: frm.doc.customer,
                        naming: frm.doc.enquiry + "_D",
                        enquiry: frm.doc.enquiry
                    }, function(doc) {
                        // Loop through the items in the business proposal and add them to the new document receiving
                        frm.doc.business_proposal_item.forEach(function(item) {
                            var new_item = frappe.model.add_child(doc, 'items');
                            new_item.item_code = item.item;
                            new_item.uom = item.uom;
                            new_item.qty = item.qty;
                            new_item.item_name = item.item_name;
                            new_item.rate =item.amount;
                            // Copy other necessary fields here if needed
                        });
                        frappe.set_route('Form', doc.doctype, doc.name);
                    });
                });
            } else {
                frm.page.clear_secondary_action();
            }
        } else {
            frm.page.clear_secondary_action();
        }


        frm.add_custom_button(__('Pending'), function() {
            frappe.confirm(
                `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                function() {
                    frm.set_value('status', 'Pending').then(function() {
                        change(frm);
                    });
                }
            );
        }, __("Change Status"));
        
        frm.add_custom_button(__('Proposal Sent'), function() {
            frappe.confirm(
                `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                function() {
                    frm.set_value('status', 'Proposal Sent').then(function(){
                        change(frm);
                    });
                }
            );
        }, __("Change Status"));
        
        frm.add_custom_button(__('Under Negotiation'), function() {
            frappe.confirm(
                `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                function() {
                    frm.set_value('status', 'Under Negotiation').then(function(){
                        change(frm);
                    });
                }
            );
        }, __("Change Status"));
        
        frm.add_custom_button(__('Completed'), function() {
            frappe.confirm(
                `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                function() {
                    frm.set_value('status', 'Completed').then(function(){
                        change(frm);
                    });
                }
            );
        }, __("Change Status"));
        
        frm.add_custom_button(__('Rejected'), function() {
            frappe.confirm(
                `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                function() {
                    frm.set_value('status', 'Rejected').then(function(){
                        change(frm);
                    });
                }
            );
        }, __("Change Status"));
        
    },
   
});
//////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////
function change(frm) {
    console.log("11111111111111111111111111111111111111111");
    var status = frm.doc.status;
    console.log("Status:", status);

    if (status === "Completed"|| "Proposal Sending") {
        
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_status",
            args: {
                status: status,
                docname: frm.docname  // Pass the document name as well
            },
            callback: function(r) {
                console.log("Callback response:", r);
                if (r.message) {

                    // frappe.msgprint(__("Status updated successfully"));
                // } else {
                //     frappe.msgprint(__("Failed to update status"));
                }
            }
        });
    }
    if (status === "Pending" || "Under Negotiation" || "Rejected") {
        
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_change",
            args: {
                status: status,
                docname: frm.docname  // Pass the document name as well
            },
            callback: function(r) {
                console.log("Callback response:", r);
                if (r.message) {

                    // frappe.msgprint(__("Status updated successfully"));
                // } else {
                //     frappe.msgprint(__("Failed to update status"));
                }
            }
        });
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////


frappe.ui.form.on("Business Proposal Item", {
    item: function(frm, cdt, cdn) {
        console.log("Item selected");
        var d = locals[cdt][cdn];
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_selling_price",
            args: {
                item_code: d.item
            },
            callback: function(r) {
                if(r.message) {
                    console.log("Received selling price:", r.message);
                    frappe.model.set_value(d.doctype, d.name, "amount", r.message);
                    frm.refresh_field("business_proposal_item"); 
                }
            }
        });
    },

    amount: function(frm,cdt,cdn){
        var d=locals[cdt][cdn];
        var amount=0;
        frm.doc.business_proposal_item.forEach(function(d) {
            amount+=d.amount;
            
        });
        frm.set_value('total_amount',amount);
        frm.refresh_field("total_amount")
       
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////


frappe.ui.form.on("Business Proposal Item","business_proposal_item_remove",function(frm,cdt,cdn){
	var d=locals[cdt][cdn];
	var total=0;
	frm.doc.business_proposal_item.forEach(function(d){
		total+=d.amount;
	});
	frm.set_value('total_amount',total)
	frm.refresh_field("total_amount")
	
});