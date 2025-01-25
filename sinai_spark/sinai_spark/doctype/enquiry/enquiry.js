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
            // if (frm.doc.status == "To Consultant") {
            //     // Check if consultant_name or consultant_remarks have values
            //     if (!frm.doc.consultant_name && !frm.doc.consultant_remarks) {
            //         // Add a custom button near the save button if fields are empty
            //         frm.page.set_secondary_action(__('To Consulting'), function() {
            //             // Create a dialog with consultant_name and consultant_remark fields
            //             let d = new frappe.ui.Dialog({
            //                 title: 'Consulting Information',
            //                 fields: [
            //                     {
            //                         label: 'Consultant Name',
            //                         fieldname: 'consultant_name',
            //                         fieldtype: 'Link',
            //                         options: 'Consultant Name',  // Assuming Consultant is the doctype
            //                         reqd: 1  // Required field
            //                     },
            //                     {
            //                         label: 'Consultant Remark',
            //                         fieldname: 'consultant_remark',
            //                         fieldtype: 'Small Text',
            //                         reqd: 0  // Optional field
            //                     }
            //                 ],
            //                 primary_action_label: 'Submit',
            //                 primary_action(values) {
            //                     // Set the values of the dialog form to the document fields
            //                     frm.set_value('consultant_name', values.consultant_name);
            //                     frm.set_value('consultant_remarks', values.consultant_remark);
    
            //                     // Optionally, save the document after setting the values
            //                     frm.save();
    
            //                     d.hide();  // Close the dialog after setting values
            //                 }
            //             });
    
            //             // Show the dialog
            //             d.show();
            //         });
            //     } else {
            //         // Remove the custom button if fields have values
            //         frm.page.clear_secondary_action();
            //     }
            // } else {
            //     // Remove the custom button if the status is not "To Consultant"
            //     frm.page.clear_secondary_action();
            // }
            
         

        } else {
            // Remove the custom button if the document is new
            frm.page.clear_secondary_action();
        }
        
        if (frm.doc.docstatus == 1) {
            if (
                frm.doc.status != "Converted" &&
                frm.doc.status != "Meeting On Going" &&
                frm.doc.status != "Meeting Done" &&
                frm.doc.status != "Proposal Sending" &&
                frm.doc.status != "Completed"
            ) {
                const statuses = [
                    { label: "Pending", value: "Pending" },
                    { label: "To Consultant", value: "To Consultant" },
                    { label: "Rejected", value: "Rejected" },
                    { label: "Hold", value: "Hold" },
                    { label: "Closed", value: "Closed" },
                    { label: "No Response", value: "No Response" },
                    { label: "Need Assistance", value: "Need Assistance" },
                    { label: "Just Data Base", value: "Just Data Base" },
                ];
        
                statuses.forEach((status) => {
                    const button = frm.add_custom_button(
                        __(status.label),
                        function () {
                            if (frm.doc.status !== status.value) {
                                frm.set_value("status", status.value);
                                frm.save();
                                // Add a class to indicate the button is permanently styled
                                button.addClass("status-changed");
                                button.css({
                                    "background-color": "#ffffff",
                                    color: "#8b8b8c",
                                });
                            }
                        },
                        __("Change Status")
                    );
        
                    // Apply permanent styling if the button already matches the status
                    if (frm.doc.status === status.value) {
                        button.addClass("status-changed");
                        button.css({
                            "background-color": "#ffffff",
                            color: "#8b8b8c",
                        });
                    }
                });
            }
        }
        
        
         
         
        if (frm.doc.status === "Converted"){
           
            
            frm.add_custom_button(__('Meeting On Going'), function() {
                frm.set_value('status', 'Meeting On Going');
            }, __("Change Status"));
            
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
            }, __("Change Status"));
        }

        if (frm.doc.status === "Meeting On Going"){
                       
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
            }, __("Change Status"));
        }

        if (frm.doc.status === "Meeting Done"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
            }, __("Change Status"));
        }

        if (frm.doc.status === "Proposal Sending"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
            }, __("Change Status"));
    
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
            }, __("Change Status"));
        }

        if (frm.doc.status === "Completed"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
            }, __("Change Status"));
    
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
            }, __("Change Status"));
            
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
            }, __("Change Status"));
        }

        

        if (frm.doc.status == "To Consultant"){
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

        }

        if (frm.doc.status == "Proposal Sending") {
                // Add a custom button near the save button
            frm.page.set_secondary_action(__('Proposal Sending'), function() {
                // Open a new "Consulting" document with enquiry reference
                frappe.new_doc('Business Proposal', {
                    consultating: frm.doc.name,
                    ref_no:frm.doc.name + "_B",
                    enquiry:frm.doc.name,
                    customer:frm.doc.customer
                });
            });
        } else {
            // Remove the custom button if the condition is not met
            frm.page.clear_secondary_action();
        }
        
        

    },
    service_code: function(frm) {
        set_reference_no(frm);
    },
    iata_code: function(frm) {
        set_reference_no(frm);
    },

    // onload:function(frm){
        // if (frm.doc.status === "Proposal Sending") {
        //         // Add a custom button near the save button
        //     frm.page.set_secondary_action(__('Proposal Sending'), function() {
        //         // Open a new "Consulting" document with enquiry reference
        //         frappe.new_doc('Business Proposal', {
        //             consultating: frm.doc.name,
        //             ref_no:frm.doc.enquiry + "_B",
        //             enquiry:frm.doc.name,
        //             customer:frm.doc.customer
        //         });
        //     });
        // } else {
        //     // Remove the custom button if the condition is not met
        //     frm.page.clear_secondary_action();
        // }

    // }
   

});
function change(frm) {

    var status = frm.doc.status;
    console.log("Status:", status);

    if (status === "Proposal Sending") {
        
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.enquiry.enquiry.get_status",
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
        
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.enquiry.enquiry.get_change",
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

function set_reference_no(frm) {
    var service_code = frm.doc.service_code;
    var iata_code = frm.doc.iata_code;

    if (service_code && iata_code) {
        // Call the server-side method to get the next reference_no
        frappe.call({
            method: "sinai_spark.sinai_spark.doctype.enquiry.enquiry.get_next_reference_no",
            args: { service_code: service_code, iata_code: iata_code },
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

