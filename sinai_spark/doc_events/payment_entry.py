import frappe
from frappe.model.document import Document

class BusinessProposal(Document):
    pass

def update_business_proposal_status(doc, method):
    """
    Updates Business Proposal status based on Payment Entry allocations.
    """
    # Extract the relevant Sales Order from the references table
    sales_order_name = None
    for reference in doc.references:
        if reference.reference_doctype == "Sales Order" and reference.reference_name:
            sales_order_name = reference.reference_name
            break  # Stop once the first Sales Order is found

    if not sales_order_name:
        return  # Exit if no Sales Order is found

    # Fetch the related Sales Order document
    sales_order = frappe.get_doc("Sales Order", sales_order_name)
    
    if not sales_order.custom_business_proposal:
        return  # Exit if the Sales Order is not linked to a Business Proposal

    business_proposal_id = sales_order.custom_business_proposal
    grand_total = sales_order.grand_total

    # Fetch all Payment Entries related to this Sales Order
    payment_entries = frappe.get_all(
        "Payment Entry Reference",
        filters={
            "reference_doctype": "Sales Order",
            "reference_name": sales_order_name,
            "parenttype": "Payment Entry",
            "docstatus": 1  # Only consider submitted Payment Entries
        },
        fields=["parent as payment_entry", "allocated_amount"]
    )

    # Calculate total allocated amount from all Payment Entries
    total_paid = sum(pe.get("allocated_amount", 0) for pe in payment_entries)

    # Fetch the Business Proposal document
    business_proposal = frappe.get_doc("Business Proposal", business_proposal_id)

    # Determine the new status
    if total_paid >= grand_total:
        new_status = "Paid"
    elif total_paid > 0:
        new_status = "Partially Paid"
    else:
        new_status = "Unpaid"

    # Update status only if changed
    if business_proposal.status != new_status:
        business_proposal.status = new_status
        business_proposal.save()
        frappe.db.commit()

# Attach the function to Payment Entry's on_submit and on_cancel events
def on_submit(doc, method):
    update_business_proposal_status(doc, method)

def on_cancel(doc, method):
    update_business_proposal_status(doc, method)
