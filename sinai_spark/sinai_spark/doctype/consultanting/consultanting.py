# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Consultanting(Document):
       pass
	# def on_update(self):
        
	# 		if self.status == "Completed":
	# 			enq = self.enquiry
	# 			if enq:
	# 				frappe.db.sql("""
	# 					UPDATE `tabEnquiry`
	# 					SET status = 'Converted'
	# 					WHERE name = %s
	# 				""", (enq,))
	# 				frappe.db.commit()
	# 		if self.status == "Pending":
	# 			enq = self.enquiry
	# 			if enq:
	# 				frappe.db.sql("""
	# 					UPDATE `tabEnquiry`
	# 					SET status = 'To Consultant'
	# 					WHERE name = %s
	# 				""", (enq,))
	# 				frappe.db.commit()
	# 		if self.status == "Proposal Sending":
	# 			enq = self.enquiry
	# 			if enq:
	# 				frappe.db.sql("""
	# 					UPDATE `tabEnquiry`
	# 					SET status = 'To Proposal'
	# 					WHERE name = %s
	# 				""", (enq,))
	# 				frappe.db.commit()



  
# ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import frappe

@frappe.whitelist()
def get_status(status, docname):
    if status == "Proposal Sending":
        doc = frappe.get_doc("Consultanting", docname)
        
        # Update Consultanting status if exists
        enq = doc.enquiry
        if enq:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'To Proposal'
                WHERE name = %s
            """, (enq,))
        
       
    return False
# ////////////////////////////////////

import frappe

@frappe.whitelist()
def get_change(status, docname):
    if status != "Proposal Sending":
        doc = frappe.get_doc("Consultanting", docname)
        
        # Update Consultanting status if exists
        enq = doc.enquiry
        if enq:
            frappe.db.sql("""
                UPDATE `tabEnquiry`
                SET status = 'To Consultant'
                WHERE name = %s
            """, (enq,))
        
      
            
    return False

	
# ///////////////////////////////