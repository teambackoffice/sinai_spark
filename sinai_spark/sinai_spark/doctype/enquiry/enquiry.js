frappe.ui.form.on("Enquiry", {
    refresh: function(frm) {
        if (frm.doc.docstatus ==1) {
            console.log("dddddddddddddd")
            frm.set_df_property('service_code', 'hidden', true);
            frm.set_df_property('iata_code', 'hidden', true);
            frm.set_df_property('reference_no', 'hidden', true);
        } else {
            frm.set_df_property('service_code', 'hidden', false);
            frm.set_df_property('iata_code', 'hidden', false);
            frm.set_df_property('reference_no', 'hidden', false);
        }

        if (!frm.is_new()) {
            // Check the value of enquiry_status and show/hide the button accordingly
            if (frm.doc.status === "To Consultant") {
                // Add a custom button near the save button
                frm.page.set_secondary_action(__('To Consulting'), function() {
                    // Open a new "Consulting" document with enquiry reference
                    frappe.new_doc('Consultanting', {
                        enquiry: frm.doc.name,
                        series:frm.doc.name + "_C",
                        customer:frm.doc.customer
                    });
                });
            } else {
                // Remove the custom button if the condition is not met
                frm.page.clear_secondary_action();
            }

          




        } else {
            // Remove the custom button if the document is new
            frm.page.clear_secondary_action();
        }

        if (frm.doc.docstatus ==1) {
            

            if(frm.doc.status!="Converted")   {

                frm.add_custom_button(__('Pending'), function() {
                    frm.set_value('status', 'Pending');
                }, __("Change Status"));
                
                frm.add_custom_button(__('To Consultant'), function() {
                    frm.set_value('status', 'To Consultant');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Rejected'), function() {
                    frm.set_value('status', 'Rejected');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Hold'), function() {
                    frm.set_value('status', 'Hold');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Closed'), function() {
                    frm.set_value('status', 'Closed');
                }, __("Change Status"));
                
                frm.add_custom_button(__('No Response'), function() {
                    frm.set_value('status', 'No Response');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Need Assistance'), function() {
                    frm.set_value('status', 'Need Assistance');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Just Data Base'), function() {
                    frm.set_value('status', 'Just Data Base');
                }, __("Change Status"));
                
                frm.add_custom_button(__('Converted'), function() {
                    frm.set_value('status', 'Converted');
                }, __("Change Status"));
                // frm.add_custom_button(__('To Proposal'), function() {
                //     frm.set_value('status', 'To Proposal');
                // }, __("Change Status"));
            }
         }

    },
    service_code: function(frm) {
        set_reference_no(frm);
    },
    iata_code: function(frm) {
        set_reference_no(frm);
    },
   

});

function set_reference_no(frm) {
    var service_code = frm.doc.service_code;
    var iata_code = frm.doc.iata_code;

    if(service_code && iata_code) {
        // Call the server-side method to get the next reference_no
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.enquiry.enquiry.get_next_reference_no",
            // method: "prago_tech.prago_tech.doctype.daily_work_record.daily_work_record.get_ss",

            args: {},
            callback: function(r) {
                if (r.message) {
                    var next_number = r.message;
                    var reference_no = service_code + iata_code + next_number;
                    frm.set_value('reference_no', reference_no);
                }
            }
        });
    }
}
