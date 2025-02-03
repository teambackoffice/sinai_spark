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
        
        
        // if (frm.doc.docstatus == 1) {
        //     if (
        //         frm.doc.status != "Converted" &&
        //         frm.doc.status != "Meeting On Going" &&
        //         frm.doc.status != "Meeting Done" &&
        //         frm.doc.status != "Proposal Sending" &&
        //         frm.doc.status != "Completed"
        //     ) {
        //         const statuses = [
        //             { label: "Pending", value: "Pending" },
        //             { label: "To Consultant", value: "To Consultant" },
        //             { label: "Rejected", value: "Rejected" },
        //             { label: "Hold", value: "Hold" },
        //             { label: "Closed", value: "Closed" },
        //             { label: "No Response", value: "No Response" },
        //             { label: "Need Assistance", value: "Need Assistance" },
        //             { label: "Just Data Base", value: "Just Data Base" },
        //         ];
        
        //         statuses.forEach((status) => {
        //             const button = frm.add_custom_button(
        //                 __(status.label),
        //                 function () {
                            
        //                     if (frm.doc.status !== status.value) {
        //                         frm.set_value("status", status.value);
        //                         frm.save();
        //                         // Add a class to indicate the button is permanently styled
        //                         button.addClass("status-changed");
        //                         button.css({
        //                             "background-color": "#ffffff",
        //                             color: "#ed1909",
        //                         });
        //                     }
        //                 },
        //                 __("Change Status")
        //             );
        
        //             // Apply permanent styling if the button already matches the status
        //             if (frm.doc.status === status.value) {
        //                 button.addClass("status-changed");
        //                 button.css({
        //                     "background-color": "#ffffff",
        //                     color: "#28a745",
        //                 });
        //             }
        //         });
        //     }
        // }
        
         




        if (frm.doc.docstatus == 1) {
            const statuses = [
                "Pending", "To Consultant", "Rejected", "Hold",
                "Closed", "No Response", "Need Assistance", "Just Data Base", "Converted",
                "Meeting On Going", "Meeting Done", "Proposal Sending", "Completed"
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
        
        
        
        
        // if (frm.doc.docstatus == 1) {
        //     // Initialize the statuses array with possible statuses
        //     const statuses = [
        //         { label: "Pending", value: "Pending" },
        //         { label: "To Consultant", value: "To Consultant" },
        //         { label: "Rejected", value: "Rejected" },
        //         { label: "Hold", value: "Hold" },
        //         { label: "Closed", value: "Closed" },
        //         { label: "No Response", value: "No Response" },
        //         { label: "Need Assistance", value: "Need Assistance" },
        //         { label: "Just Data Base", value: "Just Data Base" },
        //     ];
        
        //     // Initialize an array to track submitted statuses
        //     let submittedStatuses = [];
        
        //     // Function to update button colors dynamically
        //     function updateButtonColors() {
        //         statuses.forEach((status) => {
        //             // Use a more specific selector to target the buttons
        //             const buttonElement = $(`button[data-status='${status.value}']`);
        
        //             // Check if the status is in submittedStatuses array
        //             if (submittedStatuses.includes(status.value)) {
        //                 console.log("Status in submittedStatuses: " + status.label);
        //                 // Apply green color if the status is submitted
        //                 buttonElement.css({
        //                     backgroundColor: "#28a745", // Green for submitted statuses
        //                     color: "white" // White text for visibility
        //                 });
        //             } else {
        //                 console.log("Status NOT in submittedStatuses: " + status.label);
        //                 // Apply blue color if the status is not submitted
        //                 buttonElement.css({
        //                     backgroundColor: "#007bff", // Blue for remaining statuses
        //                     color: "white" // White text for visibility
        //                 });
        //             }
        //         });
        //     }
        
        //     // Iterate through the statuses and create the buttons
        //     statuses.forEach((status) => {
        //         const button = frm.add_custom_button(
        //             __(status.label),
        //             function () {
        //                 console.log("Button clicked for status: " + status.label);
        
        //                 // On button click, set the status and save
        //                 frm.set_value("status", status.value);
        
        //                 // Perform the save operation and update the array after it is successful
        //                 frm.save().then(function () {
        //                     // After save, add the status to submittedStatuses array
        //                     if (!submittedStatuses.includes(status.value)) {
        //                         submittedStatuses.push(status.value);
        //                         console.log("Status added to submittedStatuses: " + status.value);
        //                     } else {
        //                         console.log("Status already in submittedStatuses: " + status.value);
        //                     }
        
        //                     // Print the array to the console after each update
        //                     console.log("Current Submitted Statuses Array: ", submittedStatuses);
        
        //                     // Update button colors after saving
        //                     updateButtonColors();
        //                 }).catch(function (error) {
        //                     console.log("Save failed: ", error);
        //                 });
        //             },
        //             __("Change Status")
        //         );
        
        //         // Assign a data attribute to the button for easier selection
        //         button.attr("data-status", status.value);
        
        //         // Apply initial colors based on submittedStatuses array
        //         if (submittedStatuses.includes(status.value)) {
        //             console.log("Initial Green button for: " + status.label);
        //             button.css({
        //                 backgroundColor: "#28a745", // Green for submitted statuses
        //                 color: "white" // White text for visibility
        //             });
        //         } else {
        //             console.log("Initial Blue button for: " + status.label);
        //             button.css({
        //                 backgroundColor: "#007bff", // Blue for remaining statuses
        //                 color: "white" // White text for visibility
        //             });
        //         }
        //     });
        
        //     // Initial color update on page load
        //     updateButtonColors();
        // }
        
        
        
        if (frm.doc.status === "Converted"){
           
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Meeting On Going');
                    }
                );
            }, __("Change Status"));
            
            
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
                    }
                );
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
                    }
                );
            }, __("Change Status"));
        }

        if (frm.doc.status === "Meeting On Going"){
                       
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
                    }
                );
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
                    }
                );
            }, __("Change Status"));
        }

        if (frm.doc.status === "Meeting Done"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
                    }
                );
            }, __("Change Status"));
    
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
                    }
                );
            }, __("Change Status"));
        }

        if (frm.doc.status === "Proposal Sending"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
                    }
                );
            }, __("Change Status"));
    
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Completed'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Completed')
                    }
                );
            }, __("Change Status"));
        }

        if (frm.doc.status === "Completed"){
                       
            frm.add_custom_button(__('Meeting On Going'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting On Going')
                    }
                );
            }, __("Change Status"));
    
            frm.add_custom_button(__('Meeting Done'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Meeting Done')
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Proposal Sending'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frappe.db.set_value("Enquiry",frm.doc.name,'status', 'Proposal Sending')
                    }
                );
            }, __("Change Status"));
        }

        

        if (frm.doc.status == "To Consultant"){

            frm.add_custom_button(__('Pending'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Pending');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('To Consultant'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'To Consultant');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Rejected'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Rejected');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Hold'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Hold');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Closed'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Closed');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('No Response'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'No Response');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Need Assistance'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Need Assistance');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Just Data Base'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Just Data Base');
                    }
                );
            }, __("Change Status"));
            
            frm.add_custom_button(__('Converted'), function() {
                frappe.confirm(
                    `The status is set to "${frm.doc.status}". Do you want to Send E-mail?`,
                    function() {
                        frm.set_value('status', 'Converted');
                    }
                );
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

