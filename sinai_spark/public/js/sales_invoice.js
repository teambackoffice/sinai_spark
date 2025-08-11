frappe.ui.form.on('Sales Invoice', {
    refresh: function (frm) {
        setTimeout(() => {
            frm.remove_custom_button('Delivery', 'Create');
            frm.remove_custom_button('Payment Request', 'Create');
        }, 500);
    }
});