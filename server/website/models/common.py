from django import forms
from django.utils.safestring import mark_safe
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from website.helpers import s3, util

import re, uuid, hashlib, string, secrets, inspect

def byX( klass, *args, **kwargs ):
    try:
        if len(args) > 0:
            # Convert class names
            result = []
            for arg in args:
                if not isinstance(arg, str) and inspect.isclass(arg):
                    arg = util.camelToSnake(arg.__name__)
                result.append(arg)

            return klass.objects.select_related(*result).get(**kwargs)
        else:
            return klass.objects.get(**kwargs)
    except klass.DoesNotExist:
        return None
    except ValidationError:
        return None
    except klass.MultipleObjectsReturned:
        return None


def getByX( klass, hash, *args ):
    return byX( klass, *args, **hash )


def fromStr(choices, val, default=-1):
    val = util.xstr(val).replace('_', ' ').lower()
    val = re.sub("^\s+", "", val)
    val = re.sub("\s+$", "", val)
    for p in choices:
        if p[1].lower() == val:
            return p[0]

    return default


def fromCode(choices, code):
    code = util.xint(code)
    for p in choices:
        if p[0] == code:
            return p[1]

    return None


def cleanName(name):
    name = re.sub("^[ \t]*", "", util.xstr(name))
    name = re.sub("[^a-zA-Z0-9_. -]", "", name)
    if len(name) <= 0:
        return None

    return name


def cleanEmail(email):
    email = re.sub("[^@a-z0-9_.-]", "", util.xstr(email).lower())
    if re.search("[a-z0-9_+-]+@[a-z0-9_-]+[.][a-z]+", email) is None:
        return None

    return email


def cleanPhoneNumber(phone_number):
    phone_number = re.sub("[^0-9]", "", util.xstr(phone_number).lower())
    phone_number = re.sub("^1", "", phone_number)
    return phone_number


# Need this because you can't serialize lambda
def empty_array():
    return []


def default_auth_code():
    return str(uuid.uuid4()).upper()[:5]


def is_uuid_valid(uuid_to_test, version=4):
    try:
        uuid_obj = uuid.UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test


def upload_images( request, obj, keys, inlines=[] ):
    updated = False

    lookup = {f"{x}_file": x for x in keys}

    # Build an inline lookup
    inline_lookup = {}
    if len(inlines) > 0:
        for k in request.POST:
            if not re.search(r'-id$', k) or \
               not all([re.search(x, k) is not None for x in inlines]):
                continue

            base = re.sub(r'-id$', '', k)
            for key in lookup.keys():
                inline_lookup[f"{base}-{key}"] = (request.POST[k], lookup[key])

    # Look for files
    for f in request.FILES:
        # Gather my keys
        if len(inlines) == 0:
            if (key := lookup.get(f)) is None:
                continue

        else:
            if (ret := inline_lookup.get(f)) is None:
                continue
            if util.xint(ret[0]) != util.xint(obj.id) or util.xint(obj.id) <= 0:
                continue
            key = ret[1]
        print("Saving")

        # Download the data
        data = bytes()
        for chunk in request.FILES[f].chunks(chunk_size=0x100000):
            data += chunk

        # Based on the file, update the object
        obj.__setattr__(key, uuid.uuid4())
        url = obj.__getattribute__(f"{key}_url")()

        # Upload the file
        if s3.put_data(data, url):
            updated = True
        else:
            print(f"Failed to upload {f}")

    return updated

