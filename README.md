# Delivery App Server

Delivery App Server is a MongoDb + Express application with API Endpoints and used for food [delivery aggregator from restaurants]().

## Scripts/Commands - In Progress

To set up and run the application locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` or `yarn install` to install the required dependencies.
4. Run `node server` from the server folder: Starts the local server on your
   machine on your localhost port 2200.

## API Endpoints - In Progress

1. To receive all `restaurants` from the Server: `https://deliveryapp-sever.herokuapp.com/restaurants`
2. To receive `one restaurant` by `ID`: `https://deliveryapp-sever.herokuapp.com/restaurants/:restaurantId`
3. To receive `one restaurant` by `Slug`: `https://deliveryapp-sever.herokuapp.com/restaurants/name/:slug`
4. To receive `all Dishes` for restaurant by `ID`: `https://deliveryapp-sever.herokuapp.com/restaurants/:restaurantId/dishes`
5. To receive `one specific Dish` by `ID` for restaurant by `ID`: `https://deliveryapp-sever.herokuapp.com/:restaurantId/dishes/:dishId`
6. In Progress...

## Contributing

When contributing to this project, please follow the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) and create a separate branch for each feature or bugfix. After the changes are made, create a pull request for review.

Please make sure to replace `https://github.com/your-username/delivery-app.git` with the actual URL of your repository.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit/) file for details.
