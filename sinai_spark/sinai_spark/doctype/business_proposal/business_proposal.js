
frappe.ui.form.on("Business Proposal", {
	refresh: function(frm) {
        if (frm.doc.docstatus == 1) {
            const statuses = [
                "Pending", "Proposal Sent", "Under Negotiation", "Rejected", "Completed"
            ];
        
            let buttons = {};
            let statusHistory = new Set((frm.doc.status_history || "").split(",").map(s => s.trim()));
        
            statuses.forEach((status) => {
                let button = frm.add_custom_button(
                    __(status),
                    function () {
                        frappe.confirm(
                            `The status is set to "${status}". Do you want to Send E-mail?`,
                            function() {
                                frm.set_value("status", status);
                                statusHistory.add(status);
                                frm.set_value("status_history", Array.from(statusHistory).join(", "));
                                frm.save();
                                updateButtonColors();
                            }
                        );
                    },
                    __("Change Status")
                );
        
                buttons[status] = button;
            });
        
            function updateButtonColors() {
                Object.keys(buttons).forEach(status => {
                    buttons[status].css({ color: statusHistory.has(status) ? "#28a745" : "#dc3545" });
                });
            }
        
            updateButtonColors();
        }
         
        if (!frm.is_new()) {
            if (frm.doc.status === "Completed") {
                frm.fields_dict['business_proposal_item'].grid.wrapper.find('.grid-add-row').hide();

                frm.page.set_secondary_action(__('Document Receiving'), function() {
                    frappe.new_doc('Document Receiving', {
                        business_proposal__id: frm.doc.name,
                        customer: frm.doc.customer,
                        naming: frm.doc.enquiry + "_D",
                        enquiry: frm.doc.enquiry,
                        email_id: frm.doc.email_id
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
            }
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

        if (frm.doc.status === "Completed") {  // Check status, not docstatus
            frm.add_custom_button(__('Create Sales Order'), function() {
                frappe.call({
                    method: 'sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.create_sales_order',
                    args: { docname: frm.doc.name },
                    callback: function(r) {
                        if (r.message) {
                            frappe.msgprint(__('Sales Order {0} Created', [r.message]));
                            frappe.set_route('Form', 'Sales Order', r.message);
                        }
                    }
                });
            }, __("Create"));
        }

        if (frm.doc.status === "Under Negotiation") {
            frm.add_custom_button(__('Update Amount'), function() {
                let dialog = new frappe.ui.Dialog({
                    title: __('Update Amount for Service Code'),
                    fields: [
                        {
                            fieldtype: 'Link',
                            fieldname: 'service_code',
                            label: __('Service Code'),
                            options: 'Item'
                        },
                        {
                            fieldtype: 'Currency',
                            fieldname: 'amount',
                            label: __('Amount')
                        }
                    ],
                    primary_action_label: __('Save'),
                    primary_action: function(data) {
                        // Find the matching row in the child table
                        let child_row = frm.doc.business_proposal_item.find(row => row.item === data.service_code);
        
                        if (child_row) {
                            // Update the value in the database
                            frappe.db.set_value('Business Proposal Item', child_row.name, 'amount', data.amount)
                                .then(() => {
                                    // Update the local UI to reflect the change
                                    child_row.amount = data.amount;
                                    frm.refresh_field('business_proposal_item');
                                    frappe.msgprint(__('Amount updated successfully.'));
                                })
                                .catch(() => {
                                    frappe.msgprint(__('Failed to update the amount.'));
                                });
                        } else {
                            frappe.msgprint(__('No matching row found for the entered Service Code.'));
                        }
        
                        dialog.hide(); // Close the dialog
                    }
                });
                dialog.show();
            }, __("Update"));
        }
        
    },
    
    total_amount: function(frm) {
        if (frm.doc.total_amount) {
            frappe.call({
                method: 'sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_amount_in_words',
                args: {
                    amount: frm.doc.total_amount,// Ensure you have a currency field
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('amount_in_words', r.message);
                    }
                }
            });
        } else {
            frm.set_value('amount_in_words', '');
        }
    }

    
   
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


frappe.ui.form.on("Business Proposal Item", {
    // refresh: function(frm) {
    //     if (frm.doc.docstatus === 1 && frm.doc.status !== 'Under Negotiation') {
    //         frm.fields_dict['business_proposal_item'].grid.get_field('amount').df.read_only = 1;
    //         frm.refresh_field('business_proposal_item');
    //     }
    // },
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