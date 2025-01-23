
from frappe import _

def get_data():
	return {
		"fieldname": "business_proposal__id",
		"non_standard_fieldnames": {
		# 	"Business Proposal": "business_proposal__id",
			
		},
		"internal_links": {
			"Business Proposal": "business_proposal__id",
			"Enquiry": "enquiry"
        },
		"transactions": [
			{"label": _("Reference"), "items": ["Business Proposal", "Enquiry"]},
						
		]
    }