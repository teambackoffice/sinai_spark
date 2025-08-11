// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt
  
frappe.ui.form.on("Company Formation", {
	refresh(frm) {

        if (frm.doc.status !== 'Completed' && frm.doc.docstatus !== 'Cancelled') {

            frm.add_custom_button(__('Pending'), function() {
                frm.set_value('status', 'Pending');
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Foreign Company Formation'), function() {
                frm.set_value('status', 'To Foreign Company Formation');
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Foreign Company Document Attestation'), function() {
                frm.set_value('status', 'To Foreign Company Document Attestation');
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Saudi Company Registration'), function() {
                frm.set_value('status', 'To Saudi Company Registration');
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Investment License Issuing'), function() {
                frm.set_value('status', 'To Investment License Issuing');
            }, __("Change Status"));

            frm.add_custom_button(__('To Article Preparation'), function() {
                frm.set_value('status', 'To Article Preparation');
            }, __("Change Status"));

            frm.add_custom_button(__('To CR Issuing'), function() {
                frm.set_value('status', 'To CR Issuing');
            }, __("Change Status"));

            frm.add_custom_button(__('To Portal Opening'), function() {
                frm.set_value('status', 'To Portal Opening');
            }, __("Change Status"));

            frm.add_custom_button(__('To Invoicing'), function() {
                frm.set_value('status', 'To Invoicing');
            }, __("Change Status"));

            frm.add_custom_button(__('Completed'), function() {
                frm.set_value('status', 'Completed');
            }, __("Change Status"));
        }

//////////////////////////////////////////////////////////////////////////////////

        if (frm.doc.status === "To Foreign Company Formation") {
            frm.set_value("foreign_company_formation", 1);
            
        }
        if (frm.doc.status === "To Foreign Company Document Attestation") {
            frm.set_value("foreign_company_document_attestation", 1);
            
        }
        if (frm.doc.status === "To Saudi Company Registration") {
            frm.set_value("saudi_company_registration", 1);
            
        }



//////////////////////////////////////////////////////////////////////


        // if (frm.doc.foreign_company_formation_details && frm.doc.foreign_company_formation == 0) {
        //     cur_frm.toggle_display("foreign_company_formation_details", true);
            
        // } else {
        //     cur_frm.toggle_display("foreign_company_formation_details", false);
            
        // }

        // if (frm.doc.foreign_company_document_attestation_details) {
        //     cur_frm.toggle_display("foreign_company_document_attestation_details", true);
        // } else {
        //     cur_frm.toggle_display("foreign_company_document_attestation_details", false);
        // }



//////////////////////////////////////////////////////////////////////////////////////

        // if (frm.doc.status === "To Foreign Company Formation" && frm.doc.foreign_company_formation == 1) {
        //     cur_frm.toggle_display("foreign_company_formation", true);
            
        // }
        // //  else {
        // //     cur_frm.toggle_display("foreign_company_formation", false);
            
        // // }


        // if (frm.doc.status === "To Foreign Company Document Attestation" && frm.doc.foreign_company_document_attestation == 1) {
        //     cur_frm.toggle_display("foreign_company_document_attestation", true);
        // } 
        // // else {
        // //     cur_frm.toggle_display("foreign_company_document_attestation", false);
            
        // // }


        // if (frm.doc.status === "To Saudi Company Registration" && frm.doc.saudi_company_registration == 1) {
        //     cur_frm.toggle_display("saudi_company_registration", true);
        // }
        // //  else {
        // //     cur_frm.toggle_display("saudi_company_registration", false);
            
        // // }
     

        if (cur_frm.doc.docstatus === 1 && cur_frm.doc.status === 'To Invoicing' && cur_frm.doc.si_status === 'Not Created') {
			frm.add_custom_button(__('Sales Invoice'), function() {
                console.log("stock Sales Invoice")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_sales_invoice',
                    args: {
                    },
                    callback: function(response) {
                        frappe.set_route("Form", "Sales Invoice", response.message);                  
                    }
                });
            
            }, __("Create"));
		}


        // if (cur_frm.doc.docstatus === 1 && cur_frm.doc.status === 'To Invoicing' && cur_frm.doc.si_status === 'Not Created') {
        //     frm.add_custom_button(__("Sales Invoice"), function() {
        //         frappe.model.open_mapped_doc({
        //             method: "sinai_spark.sinai_spark.doctype.company_formation.company_formation.create_sales_invoice",
        //             args:{
        //                 // "service": frm.doc.service_item
        //             },
        //             frm : cur_frm,
        //             // callback: function(data) {
        //             //     console.log("Payment entry created successfully.");
        //             //     frappe.msgprint("Payment entry created successfully.");
        //             // }
        //             })
                        
                
        //     },__('Create'));
        // }


        

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
   