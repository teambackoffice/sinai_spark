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
                        // Custom dialog with Yes/No buttons
                        let dialog = new frappe.ui.Dialog({
                            title: __('Change Status'),
                            fields: [
                                {
                                    fieldtype: 'HTML',
                                    fieldname: 'status_message',
                                    options: `<p>The status will be set to "<strong>${status}</strong>".</p>
                                             <p>Do you want to send an email notification?</p>`
                                }
                            ],
                            primary_action_label: __('Yes'),
                            primary_action: function() {
                                // Yes button - Change status and send email
                                frm.set_value("status", status);
                                statusHistory.add(status);
                                frm.set_value("status_history", Array.from(statusHistory).join(", "));
                                frm.save().then(() => {
                                    updateButtonColors();
                                    // Call the change function with email flag
                                    changeStatus(frm, true);
                                });
                                dialog.hide();
                            },
                            secondary_action_label: __('No'),
                            secondary_action: function() {
                                // No button - Change status only, no email
                                frm.set_value("status", status);
                                statusHistory.add(status);
                                frm.set_value("status_history", Array.from(statusHistory).join(", "));
                                frm.save().then(() => {
                                    updateButtonColors();
                                    // Call the change function without email flag
                                    changeStatus(frm, false);
                                });
                                dialog.hide();
                            }
                        });
                        dialog.show();
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
                            new_item.rate = item.amount;
                            // Copy other necessary fields here if needed
                        });
                        frappe.set_route('Form', doc.doctype, doc.name);
                    });
                });
            } 
        } 

        // Remove the duplicate status change buttons (the ones below)
        // Keep only the enhanced ones above

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
    customer: function(frm) {
        if (frm.doc.customer) {
            // Get address information
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Address',
                    filters: [
                        ['Dynamic Link', 'link_doctype', '=', 'Customer'],
                        ['Dynamic Link', 'link_name', '=', frm.doc.customer]
                    ],
                    fields: ['name', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'country', 'email_id', 'phone'],
                    limit: 1
                },
                callback: function(r) {
                    if (r.message && r.message.length > 0) {
                        let addr = r.message[0];
                        let formatted_address = '';
                        
                        if (addr.address_line1) formatted_address += addr.address_line1 + '\n';
                        if (addr.address_line2) formatted_address += addr.address_line2 + '\n';
                        if (addr.city) formatted_address += addr.city + ', ';
                        if (addr.state) formatted_address += addr.state + ' ';
                        if (addr.pincode) formatted_address += addr.pincode + '\n';
                        if (addr.country) formatted_address += addr.country + '\n';
                        if (addr.email_id) formatted_address += addr.email_id + '\n';
                        if (addr.phone) formatted_address += addr.phone;
                        
                        frm.set_value('address_display', formatted_address);
                    } else {
                        frm.set_value('address_display', 'No address found');
                    }
                }
            });
    
            // Get customer contact information
            frappe.db.get_doc('Customer', frm.doc.customer)
                .then(customer => {
                    if (customer.customer_primary_contact) {
                        // Get contact details
                        frappe.db.get_doc('Contact', customer.customer_primary_contact)
                            .then(contact => {
                                // Set email
                                if (contact.email_id) {
                                    frm.set_value('email_id', contact.email_id);
                                }
    
                                // Set contact number (mobile takes priority over phone)
                                if (contact.mobile_no) {
                                    frm.set_value('contact', contact.mobile_no);
                                } else if (contact.phone) {
                                    frm.set_value('contact', contact.phone);
                                } else {
                                    frm.set_value('contact', '');
                                }
                            })
                            .catch(err => {
                                console.error('Error fetching contact details:', err);
                            });
                    } else {
                        frappe.msgprint(__('This customer does not have a primary contact.'));
                    }
                })
                .catch(err => {
                    console.error('Error fetching customer details:', err);
                });
                
        } else {
            // Clear fields when no customer is selected
            frm.set_value('email_id', '');
            frm.set_value('address_display', '');
            frm.set_value('contact', '');
            frm.refresh_field('email_id');
            frm.refresh_field('address_display');
            frm.refresh_field('contact');
        }
    },
    
    total_amount: function(frm) {
        if (frm.doc.total_amount) {
            frappe.call({
                method: 'sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_amount_in_words',
                args: {
                    amount: frm.doc.total_amount,
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

// Modified change function to accept send_email parameter
function changeStatus(frm, send_email = true) {
    console.log("Status change function called with send_email:", send_email);
    var status = frm.doc.status;
    console.log("Status:", status);

    if (status === "Completed" || status === "Proposal Sent") {
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_status",
            args: {
                status: status,
                docname: frm.docname,
                send_email: send_email  // Pass the email flag
            },
            callback: function(r) {
                console.log("Callback response:", r);
                if (r.message) {
                    if (send_email) {
                        frappe.msgprint(__("Status updated and email sent successfully"));
                    } else {
                        frappe.msgprint(__("Status updated successfully "));
                    }
                }
            }
        });
    }
    
    if (status === "Pending" || status === "Under Negotiation" || status === "Rejected") {
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.business_proposal.business_proposal.get_change",
            args: {
                status: status,
                docname: frm.docname,
                send_email: send_email  // Pass the email flag
            },
            callback: function(r) {
                console.log("Callback response:", r);
                if (r.message) {
                    if (send_email) {
                        frappe.msgprint(__("Status updated and email sent successfully"));
                    } else {
                        frappe.msgprint(__("Status updated successfully"));
                    }
                }
            }
        });
    }
}

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

frappe.ui.form.on("Business Proposal Item","business_proposal_item_remove",function(frm,cdt,cdn){
	var d=locals[cdt][cdn];
	var total=0;
	frm.doc.business_proposal_item.forEach(function(d){
		total+=d.amount;
	});
	frm.set_value('total_amount',total)
	frm.refresh_field("total_amount")
	
});