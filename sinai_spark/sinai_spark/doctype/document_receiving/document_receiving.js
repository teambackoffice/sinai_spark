// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt 
 
frappe.ui.form.on("Document Receiving", {
	refresh(frm) {

        if (cur_frm.doc.docstatus == 1 && cur_frm.doc.status === 'Completed' && cur_frm.doc.cf_status === 'Not Created' ) { 
            frm.add_custom_button(__('Company Formation'), function() {
                        console.log("Creating Company Formation document");
                        cur_frm.call({
                            doc: cur_frm.doc,
                            method: 'create_company_formation',
                            args: {},
                            callback: function(response) {
                                frappe.set_route("Form", "Company Formation", response.message);                  
                            }
                        });
                    }, __("Create"));
                
        }
       
        
        // if (cur_frm.doc.docstatus == 1 && cur_frm.doc.status === 'To Advance Payment' && cur_frm.doc.pe_status === 'Not Created') { 

        //     frm.add_custom_button(__("Payment Entry"), function() {
		// 		frappe.model.open_mapped_doc({
        //             method: "sinai_spark.sinai_spark.doctype.document_receiving.document_receiving.create_payment_entry",
        //             frm : cur_frm,
        //             // callback: function(data) {
        //             //     console.log("Payment entry created successfully.");
        //             //     frappe.msgprint("Payment entry created successfully.");
        //             // }
        //             }
						
				
		// 	},__('Create'));

  
        // }

        // if (cur_frm.doc.docstatus == 1 && cur_frm.doc.status === 'To Advance Payment' && cur_frm.doc.so_status === 'Not Created' ) { 
        //     frm.add_custom_button(__("Sales Order"), function() {
		// 		frappe.model.open_mapped_doc({
        //             method: "sinai_spark.sinai_spark.doctype.document_receiving.document_receiving.create_so",
        //             args:{
        //                 // "service": frm.doc.service_item
        //             },
        //             frm : cur_frm,
        //             // callback: function(data) {
        //             //     console.log("Payment entry created successfully.");
        //             //     frappe.msgprint("Payment entry created successfully.");
        //             // }
        //             })
        //             cur_frm.refresh_field('items');
        //             console.log("Service Item Code:", frm.doc.service_item);
                    
						
				
		// 	},__('Create'));
                
        // }




        if (cur_frm.doc.docstatus == 1 && cur_frm.doc.status === 'To Advance Payment' && cur_frm.doc.so_status === 'Not Created' ) { 
            frm.add_custom_button(__("Sales Order"), function() {
				cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_so',
                    args:{
                    },
                    frm : cur_frm,
                    callback: function(response) {
                        frappe.set_route("Form", "Sales Order", response.message);
               
                    }
                    })

			},__('Create')
        );
                
        }

        if (frm.doc.status !== 'Completed'){
            frm.add_custom_button(__('Pending'), function() {
                frm.set_value('status', 'Pending');
            }, __("Change Status"));
            
            frm.add_custom_button(__('Document Receiving & Review'), function() {
                frm.set_value('status', 'Document Receiving & Review');
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Advance Payment'), function() {
                frm.set_value('status', 'To Advance Payment');
            }, __("Change Status"));
            
            frm.add_custom_button(__('Work In Progress'), function() {
                frm.set_value('status', 'Work In Progress');
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frm.set_value('status', 'Completed');
            }, __("Change Status"));

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
});
    


frappe.ui.form.on('Item Details DR', {
    item_code: function(frm,cdt,cdn) {
    var d = locals[cdt][cdn];
    cur_frm.call({
    doc:cur_frm.doc,
    method:'get_item_price',
    args:{
        i_code:d.item_code
    },
    callback:function(r){
    frappe.model.set_value(d.doctype,d.name,"rate",r.message[0].price_list_rate);
    cur_frm.refresh_field("items")
 
    }
    })
    },
})
