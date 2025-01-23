app_name = "sinai_spark"
app_title = "Sinai Spark"
app_publisher = "sammish"
app_description = "Lead Management"
app_email = "sammish.thundiyil@gmail.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/sinai_spark/css/sinai_spark.css"
# app_include_js = "/assets/sinai_spark/js/sinai_spark.js"

# include js, css files in header of web template
# web_include_css = "/assets/sinai_spark/css/sinai_spark.css"
# web_include_js = "/assets/sinai_spark/js/sinai_spark.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sinai_spark/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Sales Order" : "public/js/sales_order.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "sinai_spark/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "sinai_spark.utils.jinja_methods",
# 	"filters": "sinai_spark.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "sinai_spark.install.before_install"
# after_install = "sinai_spark.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "sinai_spark.uninstall.before_uninstall"
# after_uninstall = "sinai_spark.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "sinai_spark.utils.before_app_install"
# after_app_install = "sinai_spark.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "sinai_spark.utils.before_app_uninstall"
# after_app_uninstall = "sinai_spark.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sinai_spark.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Sales Order": {
		# "on_update": "method",
		"on_cancel": "sinai_spark.doc_events.sales_order.on_cancel_so",
		# "on_trash": "method"
	},
    
	"Sales Invoice": {
		# "on_update": "method",
		"on_cancel": "sinai_spark.doc_events.sales_invoice.on_cancel_so",
		# "on_trash": "method"
	},
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sinai_spark.tasks.all"
# 	],
# 	"daily": [
# 		"sinai_spark.tasks.daily"
# 	],
# 	"hourly": [
# 		"sinai_spark.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sinai_spark.tasks.weekly"
# 	],
# 	"monthly": [
# 		"sinai_spark.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "sinai_spark.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "sinai_spark.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "sinai_spark.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sinai_spark.utils.before_request"]
# after_request = ["sinai_spark.utils.after_request"]

# Job Events
# ----------
# before_job = ["sinai_spark.utils.before_job"]
# after_job = ["sinai_spark.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"sinai_spark.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = [
	{
		"doctype": "Property Setter",
		"filters": [
			[
				"name",
				"in",
				[
					# "Attendance Request-to_date-read_only",
					# "Employee-employment_type-reqd",
					
				]
			]
		]
	},
    {
        "doctype": "Custom Field",
        "filters": [
            [
                "name",
                "in",
                [
					"Payment Entry-custom_document_receiving",
                    "Sales Invoice-custom_company_formation",
                    "Item-custom_scope_of_work",
                    "Sales Order-custom_document_receiving"
                   



				]
			]
		]
	},
]
