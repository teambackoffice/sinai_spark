# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Enquiry(Document):
	pass
# import frappe

# @frappe.whitelist()
# def get_next_reference_no(service_code, iata_code):
#     # Query to find the highest existing reference_no with the given service_code and iata_code
#     last_reference = frappe.db.sql("""
#         SELECT reference_no FROM `tabEnquiry`
#         WHERE service_code = %s AND iata_code = %s
#         ORDER BY reference_no DESC
#         LIMIT 1
#     """, (service_code, iata_code))

#     if last_reference:
#         # Extract the numeric suffix from the last reference_no and increment it
#         last_number = int(last_reference[0][0][-4:])
#         next_number = last_number + 1
#     else:
#         next_number = 1

#     # Format the next number to be 4 digits
#     next_reference_no = f"{service_code}{iata_code}{next_number:04d}"
#     return next_reference_no

import frappe

@frappe.whitelist()
def get_next_reference_no(service_code, iata_code):
    # Define the prefix based on service_code and iata_code
    prefix = f"{service_code}{iata_code}"

    # Query to find all reference_no with the same prefix, ordered by the numeric suffix descending
    last_reference = frappe.db.sql(f"""
        SELECT reference_no FROM `tabEnquiry`
        WHERE reference_no LIKE '{prefix}%'
        ORDER BY reference_no DESC
        LIMIT 1
    """)

    if last_reference:
        # Extract the numeric suffix from the last matching reference_no and increment it
        last_number = int(last_reference[0][0][-4:])
        next_number = last_number + 1
    else:
        # Start with 1 if no reference_no exists with the same prefix
        next_number = 1

    # Format the next number to be 4 digits with leading zeros (e.g., 0001, 0002)
    next_reference_no = f"{next_number:04d}"
    return next_reference_no


# import frappe

# @frappe.whitelist()
# def get_status(status, docname):
#     if status == "Proposal Sending":
#         doc = frappe.get_doc("Consultanting", docname)
        
#         # Update Consultanting status if exists
#         enq = doc.enquiry
#         if enq:
#             frappe.db.sql("""
#                 UPDATE `tabEnquiry`
#                 SET status = 'To Proposal'
#                 WHERE name = %s
#             """, (enq,))
        
       
#     return False
# # ////////////////////////////////////

# import frappe

# @frappe.whitelist()
# def get_change(status, docname):
#     if status != "Proposal Sending":
#         doc = frappe.get_doc("Consultanting", docname)
        
#         # Update Consultanting status if exists
#         enq = doc.enquiry
#         if enq:
#             frappe.db.sql("""
#                 UPDATE `tabEnquiry`
#                 SET status = 'To Consultant'
#                 WHERE name = %s
#             """, (enq,))
        
      
            
#     return False
