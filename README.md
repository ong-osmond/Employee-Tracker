# Employee-Tracker
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description: 
Welcome to my Employee Tracker Application using Node.js and the modules INQUIRER and MYSQL. This app features MySQL Database integration.
Inquirer is used to prompt the user to enter employee details. 

This is the link to a video demonstrating the application: https://drive.google.com/file/d/1Fo_TQwUbVrQ05auNZ_HombCUK0xGM0TN/view?usp=sharing (for the best video resolution, please select the 720p quality option).

## Table of Contents 
* [Installation](#Installation) 
* [Usage Information](#Usage) 
* [Contributing](#Contributing) 
* [Test Instructions](#Tests) 
* [Questions](#Questions) 
* [License](#License)  

## Installation: 
1. Clone the Employee Tracker project files to your local machine using this link: https://github.com/ong-osmond/Employee-Tracker.git 
2. Install NODE.js on your machine. Find the latest version on https://nodejs.org/en/
3. Open Git Bash or any Command Line tool and type in "NPM INSTALL". 
4. Install the Inquirer module by typing in "NPM INSTALL INQUIRER".
5. Install the MYSQL module by typing in "NPM INSTALL MYSQL".
6. (Optional) For better display of tables on Git Bash or the Command Line tool, install CONSOLE.TABLE by typing in "NPM INSTALL CONSOLE.TABLE".
7. Install MySQL Server on your machine. Set the host to "localhost" and the port to "3306". Create a user with Standard Authentication Type. This user's name and password will be used to initiate the app.
8. On the project's lib folder, use the "SEED.SQL" file to create the employee database and set up initial data.
9. Start your MySQL server before using the app. 

## Usage: 

1. Open Git Bash or your Command Line tool and type in "NODE APP". You will be asked to enter a valid database username and password (with read and write access) to enable the app's features.
![Run Node App](/assets/img/01-Run-Node-App.png)

2. The main menu allows you to VIEW, ADD, UPDATE or DELETE Departments, Employee Roles and Employees. Select EXIT to exit the app.
![Main Menu](/assets/img/02-Main-Menu.png)

3. This is an example of the VIEW ALL EMPLOYEES table:
![View](/assets/img/03-View-All-Employees.png)

4. The UPDATE feature allows you to edit an employee's role or manager:
![Update](/assets/img/04-Update-Employees-Options.png)

5. When adding a department, role or employee, all inputs are required.

6. When deleting a department, a role should not exist under that department to successfully delete it. Likewise, when deleting a role, no employee should be assigned to that role. Finally, when deleting an employee, that person should not be the current manager to other employees.


## Contributing: 
Everyone is welcome to contribute to this project. Please email me at ong.osmond@yahoo.com or fork the project from GitHub to your own repository.

## Tests: 
No tests have been implemented yet.
 
## Questions: 
Please visit my [GitHub Page](https://github.com/ong-osmond/) or email me your questions at ong.osmond@yahoo.com. 
I am available 8am-4pm Monday-Friday (Australian Western Standard Time). 

## License: 
MIT License

Copyright (c) 2020 Osmond Ong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
