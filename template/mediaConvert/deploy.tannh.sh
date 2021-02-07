cd dependencies/nodejs
npm i
cd ../../
sam package --template-file ./template.yaml --s3-bucket psyc-input-tannh --output-template-file ./packaged.yaml --profile devblock
sam deploy --template-file ./packaged.yaml --stack-name psyc-tannh --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND --parameter-overrides ParameterKey=Stage,ParameterValue=tannh ParameterKey=ApiUpdateMedia,ParameterValue=https://psy-api-dev.devblock.io/media/status ParameterKey=InternalKey,ParameterValue=123123 ParameterKey=AllowOrigins,ParameterValue=http://abc.abc,http://abcd.abcd --profile devblock