from django.conf import settings

from botocore.client import Config
from botocore.exceptions import NoCredentialsError, ClientError

from website.helpers import util
import re, boto3


def clean_s3_file( s3_file ):
    return re.sub('^/', '', util.xstr(s3_file))


def url( url ):
    if url is None:
        return ""

    url = util.xstr(url)
    if url == "":
        return ""

    if 'MINIO_URL' not in settings.S3_ACCESS or not settings.S3_ACCESS['MINIO_URL']:
        return "https://%s.%s.%s/%s" % (settings.S3_ACCESS['BUCKET'],
                                        settings.S3_ACCESS['REGION'],
                                        settings.S3_ACCESS['HOST'],
                                        clean_s3_file(url))

    else:
        return "https://%s.%s/%s/%s" % (settings.S3_ACCESS['REGION'],
                                        settings.S3_ACCESS['HOST'],
                                        settings.S3_ACCESS['BUCKET'],
                                        clean_s3_file(url))



def put_data(data, s3_file, bucket=None):
    if settings.UNIT_TEST:
        return True

    # Default bucket
    if bucket is None:
        bucket = settings.S3_ACCESS['BUCKET']

    # Dev code
    if 'MODE' in settings.S3_ACCESS and settings.S3_ACCESS['MODE'] == 'DEV':
        endpoint = "https://%s.%s" % (settings.S3_ACCESS['REGION'], settings.S3_ACCESS['HOST'])

        # Initialize a session using DigitalOcean Spaces.
        #session = boto3.session.Session()
        client = boto3.client('s3',
                                region_name=settings.S3_ACCESS['REGION'],
                                endpoint_url=endpoint,
                                aws_access_key_id=settings.S3_ACCESS['ACCESS_KEY'],
                                aws_secret_access_key=settings.S3_ACCESS['SECRET_KEY'])

    # Production
    else:
        client = boto3.client("s3")

    try:
        args = { "Bucket": bucket, "Key": clean_s3_file(s3_file), "Body": data }
        if 'EXTRA_ARGS' in settings.S3_ACCESS and util.xstr(settings.S3_ACCESS['EXTRA_ARGS']) != "":
            args["ACL"] = settings.S3_ACCESS['EXTRA_ARGS']
        ret = client.put_object( **args )
        return ret['ResponseMetadata']['HTTPStatusCode'] == 200

    except FileNotFoundError:
        print("The file was not found")
    except NoCredentialsError:
        print("Credentials not available")
    except ClientError:
        print("AccessDenied")

    return False


def upload_file(local_file, s3_file, bucket=None):
    raise Exception("Deprecated Function")
    # # Default bucket
    # if bucket is None:
    #     bucket = settings.S3_ACCESS['BUCKET']

    # # Server endpoint
    # endpoint = "https://%s.%s" % (settings.S3_ACCESS['REGION'], settings.S3_ACCESS['HOST'])

    # # Initialize a session using DigitalOcean Spaces.
    # session = boto3.session.Session()
    # client = session.client('s3',
    #                         region_name=settings.S3_ACCESS['REGION'],
    #                         endpoint_url=endpoint,
    #                         aws_access_key_id=settings.S3_ACCESS['ACCESS_KEY'],
    #                         aws_secret_access_key=settings.S3_ACCESS['SECRET_KEY'])

    # try:
    #     client.upload_file(local_file, bucket, s3_file,
    #                        settings.S3_ACCESS['EXTRA_ARGS'] )

    # except FileNotFoundError:
    #     print("The file was not found")
    #     return False
    # except NoCredentialsError:
    #     print("Credentials not available")
    #     return False

    # return True
    

def read_permissions(bucket=None):
    s3 = boto3.client('s3',
                      aws_access_key_id=settings.S3_ACCESS['ACCESS_KEY'],
                      aws_secret_access_key=settings.S3_ACCESS['SECRET_KEY'],
                      )

    # Default bucket
    if bucket is None:
        bucket = settings.S3_ACCESS['BUCKET']

    try:
        return s3.get_bucket_acl(Bucket=bucket)

    except NoCredentialsError:
        print("Credentials not available")
        return None


def assumed_role_session(role_arn: str):
    try:
        role = boto3.client('sts').assume_role(RoleArn=role_arn, RoleSessionName='switch-role')
        credentials = role['Credentials']
        aws_access_key_id = credentials['AccessKeyId']
        aws_secret_access_key = credentials['SecretAccessKey']
        aws_session_token = credentials['SessionToken']
        return boto3.session.Session(
            aws_access_key_id = aws_access_key_id,
            aws_secret_access_key = aws_secret_access_key,
            aws_session_token = aws_session_token
        )
    
    except NoCredentialsError:
        return None


# add a new subdomain for a tenant
def updateDns(dnsName: str):
    # Remove the dns
    if util.xstr(dnsName) == "":
        return None

    # make sure the dnsName ends with "drip7.com"
    if dnsName.endswith('drip7.com') == False:
        dnsName = dnsName + '.drip7.com'

    # Add the dns
    try:
        # Assume role from AWS account with the Route53 zone. This wont be needed after account consolidation.
        session = assumed_role_session('arn:aws:iam::202155456395:role/Allow_V2_dnsUpdates')
        if session is None:
            return None

        if (client := session.client('route53')) is None:
            return None

        settings = {
            'HostedZoneId': '/hostedzone/Z02921661DRBHJ9UTBLA4',
            'ChangeBatch': {
                'Changes': [
                    {
                        'Action': 'UPSERT',
                        'ResourceRecordSet': {
                            'Name': dnsName,
                            'Type': 'CNAME',
                            'TTL': 300,
                            'ResourceRecords': [
                                {'Value': 'v2.drip7.com'}
                            ]
                        }
                    }
                ]
            }
        }

        response = client.change_resource_record_sets(**settings)
        #return ret['ResponseMetadata']['HTTPStatusCode'] == 200

    # Is there better exceptions to catch?
    except ClientError as e:
        #debugging -- we'll want to pull out printing the error message in prod
        return "Failed to update DNS to subdomain " + dnsName + ": " + str(e)

    return None
