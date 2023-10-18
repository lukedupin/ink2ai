from django.conf import settings
from website.libs.posix_spawner import posix_spawn

import re


# Run a manager command forked 
def runManager( cmd, *args ):
    safe_args = [re.sub(r'[^a-zA-Z0-9_+=.?-]', '', x) for x in args]

    # Run my posix lib hook
    #print( settings.BASE_DIR )
    exec = ['/usr/bin/python3', 'manage.py', cmd] + safe_args
    run = f'cd {settings.BASE_DIR};' + ' '.join(exec)

    posix_spawn( '/usr/bin/sh', ['-c', run])


def runManagerQuoted( cmd, *args ):
    safe_args = [re.sub(r'[^a-zA-Z0-9_+=.? -]', '', x) for x in args]
    safe_args = [f'"{x}"' for x in safe_args]

    # Run my posix lib hook
    #print( settings.BASE_DIR )
    exec = ['/usr/bin/python3', 'manage.py', cmd] + safe_args
    run = f'cd {settings.BASE_DIR};' + ' '.join(exec)

    posix_spawn( '/usr/bin/sh', ['-c', run])
