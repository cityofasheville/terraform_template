def handler(event, context):
    try:
        print(event)
        
        return {
            'statusCode': 200,
            'body': 'Hello world!'
        }
    except BaseException as err:
        print(str(err))
        return {
            'statusCode': 500,
            'body': str(err)
        }