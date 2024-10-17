import frappe


def on_cancel_so(doc, method):
    if doc.custom_document_receiving:
        frappe.db.sql(
            """ UPDATE `tabDocument Receiving` SET status='To Advance Payment', so_status='Not Created' WHERE name=%s""",(doc.custom_document_receiving))
        frappe.db.commit()
        doc.reload()
