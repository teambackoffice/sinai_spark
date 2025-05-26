
 
import frappe
from frappe.model.document import Document

 
class BusinessProposal(Document):
    def on_cancel(self):
            if self.enquiry:
                                            
                frappe.db.sql("""UPDATE `tabEnquiry` SET status = 'To Consultant' WHERE name = %s""", self.enquiry)
                frappe.db.commit()
                self.reload()

            if self.consultating:
                frappe.db.sql("""UPDATE `tabConsultanting` SET status = 'Proposal Sending' WHERE name = %s""", self.consultating)
                            
                frappe.db.commit()
                self.reload()

    def on_submit(self):
        if self.email_id:
            subject = f"Business Proposal Submitted: {self.name}"
            message = f"""
                Dear {self.customer},<br><br>
                Your business proposal <strong>{self.name}</strong> has been successfully submitted.<br><br>
                <strong>Scope of Work:</strong><br>
            """
            for row in self.business_proposal_item:
                message += f"- {row.scope_of_work} — SAR {row.amount}<br>"

            message += f"<br><strong>Total Amount:</strong> SAR {self.total_amount}<br><br>"
            message += "Best regards,<br>Sinai Spark Team"

            frappe.sendmail(
                recipients=[self.email_id],
                subject=subject,
                message=message
            )
            frappe.db.commit()

                  
                  
# 	@frappe.whitelist()
# 	def on_update(self):
# 			print("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
			
        
# 			if self.status == "Pending":
# 				enq = self.consultating
# 				if enq:
# 					frappe.db.sql("""
# 						UPDATE `tabConsultanting`
# 						SET status = 'Proposal Sending'
# 						WHERE name = %s
# 					""", (enq,))
# 					frappe.db.commit()

			# if self.status == "Completed":
			# 	enq = self.consultating
			# 	if enq:
			# 		frappe.db.sql("""
			# 			UPDATE `tabConsultanting`
			# 			SET status = 'Completed'
			# 			WHERE name = %s
			# 		""", (enq,))
			# 		frappe.db.commit()

# 			if self.status == "Completed":
# 				enq = self.enquiry
# 				if enq:
# 					frappe.db.sql("""
# 						UPDATE `tabEnquiry`
# 						SET status = 'Converted'
# 						WHERE name = %s
# 					""", (enq,))
# 					frappe.db.commit()

	


# /////////////////////////////////////////////////////////////////////////////////////////////////////

# @frappe.whitelist()
# def get_selling_price(item_code):
#     price = frappe.get_value("Item Price", {"item_code": item_code, "selling": 1}, "price_list_rate")
#     print(price)
#     if price:
#         return price
#     else:
#         return 0 

# ////////////////////////////////////////////////////////////////////////////////////////
import frappe
from frappe import _  

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

   
# ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import frappe

@frappe.whitelist()
def get_status(status, docname):
    if status == "Completed":
        doc = frappe.get_doc("Business Proposal", docname)

        cok = doc.enquiry
        if cok:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'Completed'
                WHERE name = %s
            """, (cok,))
        
        # Commit the changes to the database
        frappe.db.commit()
        return True

    
        
    elif status == "Proposal Sent":
        doc = frappe.get_doc("Business Proposal", docname)
        
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

# ////////////////////////////////////

import frappe

@frappe.whitelist()
def get_change(status, docname):
    if status == "Pending":
        doc = frappe.get_doc("Business Proposal", docname)
        
        # Update Consultanting status if exists
        # enq = doc.consultating
        # if enq:
        #     frappe.db.sql("""
        #         UPDATE `tabConsultanting`
        #         SET status = 'Proposal Sending'
        #         WHERE name = %s
        #     """, (enq,))
        
        # Update Enquiry status if exists
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

	
# ///////////////////////////////

# import frappe

# @frappe.whitelist()
# def get_status(status, docname):
#     # Fetch the document using the provided docname
#     doc = frappe.get_doc("Business Proposal", docname)
    
#     if status == "Completed":
#         # Update Consultanting status to 'Completed'
#         enq = doc.consultating
#         if enq:
#             frappe.db.sql("""
#                 UPDATE `tabConsultanting`
#                 SET status = 'Completed'
#                 WHERE name = %s
#             """, (enq,))
        
#         # Update Enquiry status to 'Converted'
#         cok = doc.enquiry
#         if cok:
#             frappe.db.sql("""
#                 UPDATE `tabEnquiry`
#                 SET status = 'Converted'
#                 WHERE name = %s
#             """, (cok,))
#     else:
#         # Update Consultanting status to 'Proposal Sending'
#         enq = doc.consultating
#         if enq:
#             frappe.db.sql("""
#                 UPDATE `tabConsultanting`
#                 SET status = 'Proposal Sending'
#                 WHERE name = %s
#             """, (enq,))
        
#         # Update Enquiry status to 'To Consultant'
#         cok = doc.enquiry
#         if cok:
#             frappe.db.sql("""
#                 UPDATE `tabEnquiry`
#                 SET status = 'To Consultant'
#                 WHERE name = %s
#             """, (cok,))
    
#     # Commit the changes to the database
#     frappe.db.commit()
#     return True


import frappe
from frappe.utils import money_in_words
from frappe.utils import today

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
        "custom_business_proposal":doc.name,
        "items": [{
            "item_code": bp.item,
            "amount": bp.amount,  
            "qty":1,
            "delivery_date": today(),
        }]
    })

    sales_order.insert(ignore_permissions=True)
    
    return sales_order.name




