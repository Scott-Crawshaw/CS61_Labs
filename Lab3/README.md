# CS 61 Lab 3

## Author
Scott Crawshaw, Dartmouth College  
Based on code by Tim Pierson, Dartmouth College Department of Computer Science

## Purpose
This project allows an inspector to modify inspector account info in a mysql database using a command line interface and a web api.

## Instructions
- Download this repository
- Download needed packages using 'npm install'
- Make sure you have the nyc_inspections schema in mysql on your local machine
- Run MakeTable.sql to generate the required table and an initial entry
- Start the web api on your local machine by running 'nodemon api.js'
- Start the command line interface with 'python3 inspectorApp.py'
- Initially perform operations using the default user, who has the username 'username' and the password 'password'.
- Once a new inspector has been created, delete the default user for security purposes.

