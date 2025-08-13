import frappe
from frappe.model.document import Document
from frappe.utils import money_in_words
from frappe.utils import today
from frappe.utils.file_manager import get_file_path
import os

class BusinessProposal(Document):
    def before_save(self):
        if self.amended_from and not frappe.db.exists("Business Proposal", self.amended_from):
            self.amended_from = None
    
    def copy_attachments_from_amended_from(self):
        if not self.amended_from:
            return
        
        attachments = frappe.get_all("File",
            filters={
                "attached_to_doctype": self.doctype,
                "attached_to_name": self.amended_from
            },
            fields=["name", "file_name", "file_url", "is_private"]
        )
        
        for attachment in attachments:
            if attachment.file_url:
                file_path = get_file_path(attachment.file_url)
                
                if os.path.exists(file_path):
                    file_doc = frappe.get_doc("File", attachment.name)
                    new_file = frappe.copy_doc(file_doc)
                    new_file.attached_to_name = self.name
                    new_file.save(ignore_permissions=True)
                else:
                    frappe.log_error(f"File not found during amendment: {file_path}")

    def on_cancel(self):
        if self.enquiry:
            frappe.db.sql("""UPDATE `tabEnquiry` SET status = 'To Consultant' WHERE name = %s""", self.enquiry)
            frappe.db.commit()
            self.reload()

        consultating = self.get('consultating')
        if consultating:
            frappe.db.sql("""UPDATE `tabConsultanting` SET status = 'Proposal Sending' WHERE name = %s""", consultating)
            frappe.db.commit()
            self.reload()

# Email sending function
def send_status_change_email(doc, status):
    """Send email notification for status change"""
    try:
        # Get email template based on status (you can customize this)
        subject = f"Business Proposal Status Changed to {status}"
        message = f"""
        Dear Customer,
        
        Your business proposal {doc.name} status has been changed to: {status}
        
        Thank you for your business.
        
        Best regards,
        Your Company Team
        """
        
        if doc.email_id:
            frappe.sendmail(
                recipients=[doc.email_id],
                subject=subject,
                message=message,
                now=True
            )
            frappe.msgprint(f"Email sent successfully to {doc.email_id}")
        else:
            frappe.msgprint("No email address found for this customer")
            
    except Exception as e:
        frappe.log_error(f"Failed to send email: {str(e)}")
        frappe.msgprint("Failed to send email notification")

@frappe.whitelist()
def get_selling_price(item_code):
    price_list = frappe.get_value("Selling Settings", None, "selling_price_list")
    
    if not price_list:
        frappe.throw(_("Default Price List not set in Selling Settings"))

    price = frappe.get_value("Item Price", {"item_code": item_code, "price_list": price_list}, "price_list_rate")
    
    if price:
        return price
    else:
        return 0  

@frappe.whitelist()
def get_status(status, docname, send_email=True):
    """Handle status changes for Completed and Proposal Sent statuses"""
    doc = frappe.get_doc("Business Proposal", docname)
    
    if status == "Completed":
        cok = doc.enquiry
        if cok:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'Completed'
                WHERE name = %s
            """, (cok,))
        
        # Send email if requested
        if send_email and str(send_email).lower() != 'false':
            send_status_change_email(doc, status)
        
        frappe.db.commit()
        return True
        
    elif status == "Proposal Sent":
        cok = doc.enquiry
        if cok:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'Converted'
                WHERE name = %s
            """, (cok,))
        
        # Send email if requested
        if send_email and str(send_email).lower() != 'false':
            send_status_change_email(doc, status)
        
        frappe.db.commit()
        return True
        
    return False

@frappe.whitelist()
def get_change(status, docname, send_email=True):
    """Handle status changes for Pending, Under Negotiation, and Rejected statuses"""
    doc = frappe.get_doc("Business Proposal", docname)
    
    if status == "Pending":
        cok = doc.enquiry
        if cok:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'Converted'
                WHERE name = %s
            """, (cok,))
        
        # Commit the changes to the database
        frappe.db.commit()
        return True
            
    return False

@frappe.whitelist()
def get_amount_in_words(amount, currency=None):
    """Convert a number to words"""
    if not amount:
        return ""
    return money_in_words(amount, currency)

@frappe.whitelist()
def create_sales_order(docname):
    doc = frappe.get_doc("Business Proposal", docname)
    bp = frappe.get_doc("Business Proposal Item", {"parent": docname})
    
    sales_order = frappe.get_doc({
        "doctype": "Sales Order",
        "customer": doc.customer,
        "custom_business_proposal": doc.name,
        "items": [{
            "item_code": bp.item,
            "amount": bp.amount,  
            "qty": 1,
            "delivery_date": today(),
        }]
    })

    sales_order.insert(ignore_permissions=True)
    
    return sales_order.name