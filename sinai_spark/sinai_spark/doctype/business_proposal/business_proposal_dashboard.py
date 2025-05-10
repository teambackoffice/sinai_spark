from __future__ import unicode_literals
from frappe import _
def get_data():
    return {
        'heatmap': True,
        'heatmap_message': _('This is based on transactions against this Business Proposal. See timeline below for details'),
        'fieldname': 'enquiry',
        'transactions': [
            {
                'label': _('Document Recieving'),
                'items': ['Document Recieving']
            },
            {
                # 'label': _('Reference'),
                'items': ['Enquiry']
            }
        ],
        "internal_links": {
            "Enquiry": "enquiry"
        }
    }
