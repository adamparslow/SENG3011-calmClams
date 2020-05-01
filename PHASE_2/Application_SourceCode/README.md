#### Structure
The frontend serves a single page application used to visualise reports and time series data
The backend correlates time series data and constructs predicitons both of which are used by the time series data analysis

#### Deployment Instructions
cd into the frontend and backend directories in seperate terminals and run `yarn install && yarn start`

or alternatively just run the following from this directory
`xterm -hold -title "backend" -e "cd backend; yarn install && yarn start" & xterm -hold -title "frontend" -e "cd frontend; yarn install && yarn start"`
