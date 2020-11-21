# Scott Crawshaw, Dartmouth CS61, Spring 2020, Lab 3
# Based on code written by Tim Pierson, Dartmouth College Department of Computer Science, Spring 2020

import argparse 
import requests

def make_get_call(url):
    resp = requests.get(url)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return
    for inspector in resp.json()['response']:
        print(inspector)


def make_post_call(url, data):
    resp = requests.post(url, json=data)
    if resp.json()['status'] != 201:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return
    print("Inspector Successfully Added")

def make_put_call(url,data):
    resp = requests.put(url, json=data)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return
    print("Inspector Successfully Updated")

def make_delete_call(url):
    resp = requests.delete(url)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return
    print("Inspector Successfully Deleted")


# CLI Code
print("Hello Inspector!")
while True:
    print("\nUse one of the following commands access the database, or QUIT to quit:")
    print("CREATE - This command lets you create a new inspector entry")
    print("READ - This command lets you get information on one or many inspectors")
    print("UPDATE - This command lets you update properties of a given inspector")
    print("DELETE - This command lets you delete an inspector from the database")

    inputCommand = input("Type your command here: ")
    if inputCommand == "QUIT":
        break
    if inputCommand == "CREATE":
        fullname = input("Inspector's name: ")
        salary = input("Inspector's salary: ")
        isAdminString = input("Is this inspector an admin (TRUE or FALSE): ")
        isAdmin = False
        if isAdminString == "TRUE":
            isAdmin = True
        username = input("Inspector's username: ")
        password = input("Inspector's password: ")
        print('Thanks for providing the information of the inspector you would like to create.')
        print('To authorize this creation, please provide your username and password.')
        loginUsername = input("Username: ")
        loginPassword = input("Password: ")
        data = {'fullname' : fullname, 'salary': salary, 'isAdmin' : isAdmin, 'username' : username, 'password' : password}
        make_post_call('http://localhost:3000/api/inspectors?loginUsername=%s&loginPassword=%s' % (loginUsername, loginPassword), data)

    if inputCommand == "READ":
        inputID = input("Please enter the ID of the inspector you would like to view, or leave it blank to view all inspectors: ")
        print('To authorize this read, please provide your username and password.')
        loginUsername = input("Username: ")
        loginPassword = input("Password: ")
        if inputID == "":
            make_get_call('http://localhost:3000/api/inspectors?loginUsername=%s&loginPassword=%s' % (loginUsername, loginPassword))
        else:
            make_get_call('http://localhost:3000/api/inspectors/%s?loginUsername=%s&loginPassword=%s' % (inputID, loginUsername, loginPassword))
    
    if inputCommand == "UPDATE":
        inputID = input("ID of the inspector you would like to update: ")
        inputAttribute = input("Attribute that you would like to update (fullname, salary, dateofhire, isAdmin, username, or password): ")
        inputValue = input("New value of attribute: ")
        print('To authorize this update, please provide your username and password.')
        loginUsername = input("Username: ")
        loginPassword = input("Password: ")
        make_put_call('http://localhost:3000/api/inspectors/%s?loginUsername=%s&loginPassword=%s' % (inputID, loginUsername, loginPassword), {'attribute' : inputAttribute, 'value' : inputValue})

    if inputCommand == "DELETE":
        inputID = input("ID of the inspector you would like to delete: ")
        print('To authorize this delete, please provide your username and password.')
        loginUsername = input("Username: ")
        loginPassword = input("Password: ")
        make_delete_call('http://localhost:3000/api/inspectors/%s?loginUsername=%s&loginPassword=%s' % (inputID, loginUsername, loginPassword))