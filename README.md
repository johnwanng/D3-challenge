# D3-challenge
D3 Homework - Data Journalism and D3

## Introduction

In this project, using the D3 techniques we will create a scatter plot that represents each state in US with circle elements. The main javascript file name will be app.js (under the 'js' folder) which pulls the data from data.csv file (under the 'data' folder). 

The scatter plot also includes demographics and other risk factors information. X and Y Axises can be clicked and are driven by click events so that users can decide which data to display. The changes are transitions for the circles' locations as well as the range of both X and Y axes.
 
Each circle also contains tooltip to reveal a specific element's data when the user hovers their cursor over the element. The d3-tip.js plugin developed by Justin Palmer was used to achieve it.

# Technologies
 
Javascript
 
## Setup 

1. Download and extract the zip file

2. Open Terminal (on Mac) or Open Bash (on PC)

3. Navigate to the 'D3-challenge\D3_data_journalism\' folder

4. Open Visual Studio Code and open a new terminal session.

5. Navigate to the 'D3-challenge\D3_data_journalism\' folder for the new terminal session.

6. Enter command 'python -m http.server' which will create a new web server session on your PC.

7. Open a new browser session and enter 'localhost:8000/' and the scatter plot should show up.