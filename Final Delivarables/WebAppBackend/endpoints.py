from flask import request, jsonify
from flask_pymongo import pymongo
import warnings
warnings.simplefilter("ignore")

con_string = "mongodb+srv://chandhu:Chandhu@cluster0.ih2ppdh.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(con_string)
db = client.get_database('rssia')
user_collection = pymongo.collection.Collection(db, 'users')

def project_api_routes(endpoints):
    @endpoints.route('/add_user',methods=['POST'])
    def add_user():
        resp = {}
        email = request.form.get('email')
        password = request.form.get('password')
        if email and password and request.method == 'POST':
            user_collection.insert_one({'email': email, 'password': password})
            status = {
                "statusCode":"200",
                "statusMessage":"User added Successfully.",
            }
            resp["status"] =status
            return resp
        else:
            return not_found()
    
    @endpoints.route('/get_users', methods=['GET'])
    def get_user():
        resp = {}
        users = user_collection.find()
        resp = [{'email' : user['email'], 'password' : user['password']} for user in users]
        return jsonify(resp)

    @endpoints.errorhandler(404)
    def not_found(error=None):
        message = {
            'status': 404,
            'message': 'Not found ' + request.url
        }
        resp = jsonify(message)
        resp.status_code = 404
        return resp

    return endpoints