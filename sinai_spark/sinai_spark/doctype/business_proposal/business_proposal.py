
 
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


