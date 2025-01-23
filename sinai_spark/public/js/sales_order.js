frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
        // Remove payment request button
        setTimeout(() => {
            frm.remove_custom_button('Payment Request', 'Create');
        }, 500);
    }
});