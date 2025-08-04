Teacher Information Portal
A full-stack web application designed to manage educator information efficiently and securely. The application features a modern, responsive front-end built with React and a robust, secure back-end powered by Spring Boot.

Key Features
Full CRUD Functionality: Create, Read, Update, and Delete teacher records across different institution types (University, College, Standalone).

Secure Authentication: The application is protected with JWT (JSON Web Token) based security. Users must register and log in to access and modify data.

Role-Ready: The security foundation is in place to easily add role-based access control (e.g., ADMIN vs. USER) in the future.

Document Uploads: Users can upload documents (e.g., qualifications) for each teacher, which are linked by an AISHE code.

Dynamic Front-End: A clean and responsive user interface built with React and styled with Tailwind CSS, providing a seamless user experience.

Interactive API Documentation: Integrated with Swagger UI for easy testing and exploration of the back-end REST API.

Tech Stack
Back-End:

Java

Spring Boot

Spring Security (with JWT)

Spring Data JPA / Hibernate

PostgreSQL

Maven

Front-End:

React

Vite

Tailwind CSS

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You will need the following software installed on your computer:

Java Development Kit (JDK) (Version 11 or higher)

Apache Maven

PostgreSQL

Node.js and npm

Back-End Setup (teacher-portal-backend)
Navigate to the backend folder:

cd teacher-portal-backend

Configure the Database:

Open the src/main/resources/application.properties file.

Update the spring.datasource.url, spring.datasource.username, and spring.datasource.password properties to match your local PostgreSQL setup.

Update the jwt.secret with your own private secret key.

Run the Application:

You can run the application using your IDE (like IntelliJ or Eclipse) or by building it with Maven and running the .jar file.

# Build the application
mvn clean install

# Run the application
java -jar target/project-0.0.1-SNAPSHOT.jar

The back-end server will start on http://localhost:8080.

Front-End Setup (teacher-portal-frontend)
Navigate to the frontend folder:

cd teacher-portal-frontend

Install Dependencies:

This will download all the necessary libraries for the React app.

npm install

Run the Development Server:

npm run dev

The front-end application will be available at http://localhost:5173.

API Endpoints
The API is documented via Swagger UI, which can be accessed at http://localhost:8080/swagger-ui.html once the back-end is running.

Authentication Endpoints:

POST /api/auth/register: Creates a new user account.

POST /api/auth/login: Authenticates a user and returns a JWT.

Teacher Info Endpoints (Protected):

GET /teacherinfo: Fetches a list of teachers by type.

POST /teacherinfo: Creates a new teacher record.

DELETE /teacherinfo/{type}/{id}: Deletes a teacher record.

And more...
