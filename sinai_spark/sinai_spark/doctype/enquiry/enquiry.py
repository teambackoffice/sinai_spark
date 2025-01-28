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
    # Query to find the highest numeric suffix across all reference_no
    last_reference = frappe.db.sql("""
        SELECT reference_no FROM `tabEnquiry`
        ORDER BY CAST(SUBSTRING(reference_no, -4) AS UNSIGNED) DESC
        LIMIT 1
    """)

    if last_reference:
        # Extract the numeric suffix from the last global reference_no and increment it
        last_number = int(last_reference[0][0][-4:])
        next_number = last_number + 1
    else:
        # Start with 1 if no reference_no exists at all
        next_number = 1

    # Format the next number to be 4 digits with leading zeros (e.g., 0001, 0002)
    next_reference_no = f"{next_number:04d}"
    return next_reference_no

@frappe.whitelist()
def send_mail_to_hr(docname):
    try:
        # Fetch the document
        doc = frappe.get_doc("Business Proposal", docname)

        # Fetch HR email(s) from Has Role
        role = frappe.db.get_value("Sinai Spark Settings", None, "role")

        if not role:
            return frappe.throw("No HR Manager's email found in the system.")

        # Email details
        if doc.status == "Pending":
            subject = f"Business Proposal {doc.name} is Pending"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Pending</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "To Consultant":
            subject = f"Business Proposal {doc.name} is To Consultant"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>To Consultant</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Rejected":
            subject = f"Business Proposal {doc.name} is Rejectedt"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Rejected</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Hold":
            subject = f"Business Proposal {doc.name} is Hold"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Hold</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Closed":
            subject = f"Business Proposal {doc.name} is Closed"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Closed</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "No Response":
            subject = f"Business Proposal {doc.name} is No Response"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>No Response</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Rejected":
            subject = f"Business Proposal {doc.name} is Rejected"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Rejected</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Need Assistance":
            subject = f"Business Proposal {doc.name} is Need Assistance"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Need Assistance</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """
        elif doc.status == "Just Data Base":
            subject = f"Business Proposal {doc.name} is Just Data Base"
            message = f"""
                Hello Team,<br><br>
                The business proposal <b>{doc.name}</b> has been moved to the status <b>Just Data Base</b>.<br>
                Please review the details and take necessary action.<br><br>
                Regards,<br>
                System Notification
            """

        # Send email
        frappe.sendmail(
            recipients=role,
            subject=subject,
            message=message,
        )
        return "success"

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Business Proposal Email Error")
        return "error"


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
