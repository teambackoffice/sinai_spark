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
