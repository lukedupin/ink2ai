from django.contrib import admin

# Register admin
from website.models import *


# Register your models here.
class MyAdminSite( admin.AdminSite ):
    # Text to put at the end of each page's <title>.
    site_title = 'StableDiffXL Super Admin'

    # Text to put in each page's <h1>.
    site_header = 'StableDiffXL Super Admin'

    # Text to put at the top of the admin index page.
    index_title = 'StableDiffXL Super Admin'


# Build my admin interface
admin_site = MyAdminSite()
for klass in []:
    admin_site.register( klass, klass.customAdmin())
