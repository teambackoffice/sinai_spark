# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt
  
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc 
from datetime import date
from frappe.utils import today
 

class DocumentReceiving(Document):



	@frappe.whitelist()
	def get_item_price(self,i_code):
		price = frappe.db.sql("""select price_list_rate from `tabItem Price` where item_code=%s and price_list='Standard Selling' """,i_code,as_dict=1)
		print("price----")
		if price:
			print(price)
			return price
	

	@frappe.whitelist()
	def create_company_formation(self):
		cf = frappe.new_doc("Company Formation")

		cf.naming = self.enquiry + "_CF"
		cf.customer = self.customer
		cf.document_receiving = self.name
		cf.company = self.company
		cf.email_id = self.email_id

		for item in self.items:
			cf.append("items", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"uom":item.uom,
				"qty":item.qty,
				"rate":item.rate,
				"sales_order":self.sales_order
			})

		cf.insert()
		cf.save()
		frappe.db.sql("""UPDATE `tabDocument Receiving` SET cf_status= 'Created' WHERE name=%s""",self.name)
		frappe.db.commit()
		self.reload()
		return cf.name
	

	@frappe.whitelist()
	def create_so(self):
		so = frappe.new_doc("Sales Order")

		so.customer = self.customer
		so.custom_document_receiving = self.name
		so.company = self.company
		so.delivery_date = today()

		for item in self.items:
			so.append("items", {
				"item_code": item.item_code,
				"item_name": item.item_name,
				"uom":item.uom,
				"qty":item.qty,
				"rate":item.rate,
			})

		so.insert()
		so.save()
		self.sales_order = so.name
		print("sales ordr",so.name)
		self.save()

		frappe.db.sql("""UPDATE `tabDocument Receiving` SET so_status= 'Created' WHERE name=%s""",self.name)
		frappe.db.sql("""UPDATE `tabDocument Receiving` SET status= 'Work In Progress' WHERE name=%s""",self.name)
		frappe.db.commit()

		self.reload()
		frappe.msgprint("Sales Order Created Successfully.")
		return so.name
	


	
# @frappe.whitelist(allow_guest=True)
# def create_so(self, target_doc=None):
	
# 	doclist = get_mapped_doc("Document Receiving", self, {
# 		"Document Receiving": {
# 			"doctype": "Sales Order",
# 			"field_map": {
# 				"customer": "customer",
# 				"name": "custom_document_receiving",
# 				# "items":"items"
# 			}
# 		}
# 	}, target_doc)
# 	frappe.db.sql("""UPDATE `tabDocument Receiving` SET so_status= 'Created' WHERE name=%s""",self)
# 	frappe.db.sql("""UPDATE `tabDocument Receiving` SET status= 'Work In Progress' WHERE name=%s""",self)
# 	frappe.db.commit()
# 	return doclist


		
# @frappe.whitelist(allow_guest=True)
# def create_payment_entry(self, target_doc=None):
# 	print("haiiiiiiiiiiii")
# 	doclist = get_mapped_doc("Document Receiving", self, {
# 		"Document Receiving": {
# 			"doctype": "Payment Entry",
# 			"field_map": {
# 				"customer": "party",
# 				"name":"custom_document_receiving",
# 				"party_type":"party_type",
# 			}
# 		}
		
# 	}, target_doc)
# 	frappe.db.sql("""UPDATE `tabDocument Receiving` SET pe_status= 'Created' WHERE name=%s""", self)
# 	frappe.db.sql("""UPDATE `tabDocument Receiving` SET status = 'Work In Progress' WHERE name=%s""",self)
# 	frappe.db.commit()
# 	return doclist
	

	# def on_cancel(self):

	# 	if self.document_receiving:

	# 		frappe.db.sql("""UPDATE `tabDocument Receiving` SET status = 'Completed' WHERE name = %s""", self.document_receiving)
	# 		frappe.db.sql("""UPDATE `tabDocument Receiving` SET cf_status = 'Not Created' WHERE name = %s""", self.document_receiving)
	# 		frappe.db.commit()
	# 	self.reload()


  