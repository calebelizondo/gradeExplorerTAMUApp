This repo defines the front and backend of a Texas A&M grade dashboard. 

## About the application
This application provides a convenient dashboard for Texas A&M-College Station students to compare previous grades given by instructors and their course evaluation results. This can be especially useful when registering for classes or during add/drop week. 

## Tech stack
Postgresql -> Django -> React

Sections are stored in the PSQL instance and are associated with an instructor, number of As, Bs etc, and course evaluation results. The Django instance provides URL endpoints for the React frontend to request and access data.

## Other Tech used
Visual Studio code, Render (for deployment), Github Co-Pilot

## About the data
Grade and course evaluation data is public and posted at this address: https://www.kaggle.com/datasets/sst001/texas-a-and-m-university-grades-and-aefis-dataset?resource=download. This data was used under the provided creative commons license: https://creativecommons.org/licenses/by-nc-sa/4.0/. 

## Where can I find the deployment?
This application is hosted on this address: 

It can also be found on The Battalion's website at this address: