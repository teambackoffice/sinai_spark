frappe.ui.form.on("Consultanting", {
    refresh: function(frm) {
        // Ensure the button is only shown for existing documents
        if (!frm.is_new()) {
            // Check the value of enquiry_status and show/hide the button accordingly
            if (frm.doc.status === "Proposal Sending") {
                // Add a custom button near the save button
                frm.page.set_secondary_action(__('Proposal Sending'), function() {
                    // Open a new "Consulting" document with enquiry reference
                    frappe.new_doc('Business Proposal', {
                        consultating: frm.doc.name,
                        ref_no:frm.doc.enquiry + "_B",
                        enquiry:frm.doc.enquiry,
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

        frm.add_custom_button(__('Pending'), function() {
            frm.set_value('status', 'Pending').then(function(){
                change(frm);
            });
        }, __("Change Status"));
        
        frm.add_custom_button(__('Meeting On Going'), function() {
            frm.set_value('status', 'Meeting On Going').then(function(){
                change(frm);
            });
        }, __("Change Status"));
        
        frm.add_custom_button(__('Meeting Done'), function() {
            frm.set_value('status', 'Meeting Done').then(function(){
                change(frm);
            });
        }, __("Change Status"));

        frm.add_custom_button(__('Proposal Sending'), function() {
            frm.set_value('status', 'Proposal Sending').then(function(){
                change(frm);
            });
        }, __("Change Status"));
        
        frm.add_custom_button(__('Completed'), function() {
            frm.set_value('status', 'Completed').then(function(){
                change(frm);
            });
        }, __("Change Status"));
        
       
        

    },

});

function change(frm) {
    console.log("11111111111111111111111111111111111111111");
    var status = frm.doc.status;
    console.log("Status:", status);

    if (status === "Proposal Sending") {
        console.log("2222222222222222222222222222");

        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.consultanting.consultanting.get_status",
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
    if (status === "Pending" || "Meeting On Going" || "Meeting Done" || "Completed") {
        console.log("reject");

        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.consultanting.consultanting.get_change",
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