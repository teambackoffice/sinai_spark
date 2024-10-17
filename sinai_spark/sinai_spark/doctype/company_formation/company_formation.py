# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt
 
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc 

 
class CompanyFormation(Document):



	@frappe.whitelist()
	def create_sales_invoice(self):
		spark =frappe.get_doc('SinaiSpark Settings')

		frappe.db.sql("""UPDATE `tabCompany Formation` SET status= 'Completed' WHERE name=%s""",self.name)
		frappe.db.sql("""UPDATE `tabCompany Formation` SET si_status= 'Created' WHERE name=%s""",self.name)
		frappe.db.commit()

		sales_inv = frappe.new_doc("Sales Invoice")
		sales_inv.custom_company_formation = self.name
		sales_inv.customer = self.customer
		sales_inv.company = self.company
		
		for item in self.items:
			sales_inv.append("items", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"uom":item.uom,
				"qty":item.qty,
				"rate":item.rate,
				"sales_order":item.sales_order,
			})

	

		sales_inv.insert(ignore_permissions=True)
		sales_inv.save()
		frappe.msgprint("Sales Invoice Created")






# @frappe.whitelist(allow_guest=True)
# def create_sales_invoice(self, target_doc=None):
# 	doclist = get_mapped_doc("Company Formation", self, {
# 		"Company Formation": {
# 			"doctype": "Sales Invoice",
# 			"field_map": {
# 				"customer": "customer",
# 				"name": "custom_company_formation",
# 				# "items":"items"
# 			}
# 		}
# 	}, target_doc)
# 	frappe.db.sql("""UPDATE `tabCompany Formation` SET si_status= 'Created' WHERE name=%s""",self)
# 	frappe.db.commit()
# 	return doclist


	def on_cancel(self):

		if self.document_receiving:

			frappe.db.sql("""UPDATE `tabDocument Receiving` SET status = 'Completed' WHERE name = %s""", self.document_receiving)
			frappe.db.sql("""UPDATE `tabDocument Receiving` SET cf_status = 'Not Created' WHERE name = %s""", self.document_receiving)
			frappe.db.commit()
			self.reload()




	
		

