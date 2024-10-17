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
}); 
   