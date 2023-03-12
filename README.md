# ask-your-CVN-coaches-site
CAPSTONE PLANNING DOCUMENTATION:
“Ask your Coaches” Web App

Planning Summary

	Often the only time we can have a good dialogue with our athletes about things like technique adjustments, waxing, etc. is during practice or right before a race while we have the wax benches going. I thought it would be a value add for our team to have a site they could visit where they could post questions and our team of coaches could respond. 
There is a separate page for admins to answer questions. This would help to maintain a clear separation of responsibilities and access levels between regular users and admins.
To set up the system so that regular users cannot access the admin page, I have implemented user authentication and authorization. When a user logs in, the system should verify their identity and determine whether they are a regular user or an admin. If the user is an admin, they can log in via the link to the admin page from the main site. If the user is a regular user, they cannot use their credentials to log in as an admin.
To ensure that the admin's answers populate back on the user's page, I’m using a database to store the questions and answers. When a user posts a question, the question will be stored in the database with a unique identifier. When an admin answers the question on the admin page, the answer will also be stored in the database with the same identifier as the question.
On the user's page, the system will retrieve the questions and answers from the database and display them to the user. This involves specific programming on the backend to retrieve the data from the database and complementary front-end programming to display the data to the user.


Features for the app include:

The ability to post anonymously - enabling newer skiers to ask meaningful questions despite the nerves that come with being new to the sport/younger than their peers.
Posts are made on the front end and are handled on the server side by GET and POST requests to serve the front end. The server code sends the post data to the db using Sequelize/PostgreSQL
The use of a database to collect questions and answers from coaching staff.
Seeded db via code in the server file. DB values include Strings and Booleans.
An FAQ section which listens for certain keywords in questions then populates different tables for the user on the page, e.g. “wax,” “technique,” “racing strategy,” etc., allowing site users to easily scroll through FAQs that relate to their questions. This would hopefully create a living resource that grows over time.
To ensure that the admin's answers populate back on the user's page, I will use a database to store the questions and answers. When a user posts a question, the question would be stored in the database with a unique identifier. When an admin answers the question on the admin page, the answer would also be stored in the database with the same identifier as the question.
On the user's page, the system will retrieve the questions and answers from the database and display them to the user. This will require programming on the backend to retrieve the data from the database and some front-end programming to display the data to the user.

Security Features:

It will be important to ensure that the system is secure and that user data is protected. This will require implementing appropriate security measures such as encryption, user authentication, and authorization, and data validation


Link to Google Doc with site Screenshots:
https://docs.google.com/document/d/1T0kdfKhxulXTHMIOUfziIs_UGBe0NF4ckUsWXSQhuRU/edit?usp=sharing


Description of App
This app allows athletes to post questions, anonymously or not, for the coaching staff to answer with the ability to link to articles and other media. FAQ sections are auto-populated below the question box as coaches respond, based on keywords. Admins have a separate page to answer questions to maintain clear separation of responsibilities and access levels. User authentication and authorization are implemented to ensure only admins can access the admin page. Questions and answers are stored in a database with a unique identifier. The system retrieves the questions and answers from the database and displays them on the user's page.


Description of Code
	The HTML and CSS styling can be viewed in the provided code files and is not wholly complex. The CSS styling uses color hex values that correspond to colors in our team’s uniforms and a photo I took of one of our local ski trails this year.
	The client-side javascript code uses Axios to make HTTP requests to the server. The code listens for form submissions on two pages: one with a form ID of "question_submit" and the other with an ID of "admin_login". When the "question_submit" form is submitted, the code sends a POST request to the server with the form data, and clears the form fields if the server responds successfully. When the "admin_login" form is submitted, the code sends a POST request to http://localhost:4004/login with the form data, and stores the user ID and access token in localStorage if the server responds successfully. Finally, the code sends a GET request to http://localhost:4004/getQuestions to retrieve a list of questions and their associated answers, and displays them on the page according to their category field.
	The server-side JavaScript code uses Node.js and the Express framework, along with middleware for handling incoming request data, Passport.js for session management and LocalStrategy authentication, and Sequelize for connecting to a PostgreSQL database. It defines three tables - users, questions, and answers - and their relationships, and includes pre-populated sample data.
To handle user authentication, the code uses LocalStrategy to check the user's provided credentials against the hashed password stored in the database using bcrypt. Once authenticated, users can access a restricted endpoint that returns only the questions associated with their user account.
Two routes are defined for accessing the questions table - one for regular users and one for authenticated users. The regular user route retrieves all questions from the database and returns them as JSON, while the authenticated user route retrieves only the questions associated with the currently authenticated user.
