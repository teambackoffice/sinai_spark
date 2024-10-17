import frappe


def on_cancel_so(doc, method):
    if doc.custom_company_formation:
        frappe.db.sql(
            """ UPDATE `tabCompany Formation` SET status='To Invoicing', si_status='Not Created' WHERE name=%s""",(doc.custom_company_formation))
        frappe.db.commit()
        doc.reload()
