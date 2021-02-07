#/bin/bash

ENV=$1
AWSRegion="us-west-2"
AWSPROFILE=$2

if [[ -z "$ENV" ]]; then
  echo -e "\n====> ERROR: ENV can not be empty\n"
  exit 1
fi

# echo -e "\n====>Upload Infrastructure File to S3"
# cd template
# aws s3 cp . s3://$ENV-Psyc-$S3Resource/ --recursive --exclude "*" --include "*.yml" --profile $AWSPROFILE
# cd ../
#API
aws cloudformation deploy --template-file root.yml --stack-name $ENV-Psyc-api --parameter-overrides Stage=$ENV \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM  --profile $AWSPROFILE


