package main

import (
	// Import Fiber Swagger
	swagger "github.com/arsmn/fiber-swagger/v2"
	// Import Go Fiber
	"github.com/gofiber/fiber/v2"
	// Side Effect import for auto-generated swagger documentation
	_ "github.com/douyu/juno/docs"
)

// @title Fiber Example API
// @version 1.0
// @description This is a sample swagger for Fiber
// @contact.name API Support
// @contact.email youremail@provider.com
// @host localhost:3000
// @BasePath /
func main() {
	// Create new Fiber application
	app := fiber.New()

	// Add endpoint to serve swagger documentation
	app.Get("/swagger/*", swagger.New(swagger.Config{ // custom
		URL:         "/swagger/doc.json",
		DeepLinking: false,
	}))

	// Add endpoint to get an item by it's ID
	app.Get("/api/item/:id", GetItem)

	// Listen on the port '3000'
	app.Listen(":3000")
}

// GetItem godoc
// @Summary Get an item
// @Description Get an item by its ID
// @ID get-item-by-int
// @Accept  json
// @Produce  json
// @Tags Item
// @Param id path int true "Item ID"
// @Success 200 {object} Item
// @Failure 400 {object} HTTPError
// @Failure 404 {object} HTTPError
// @Failure 500 {object} HTTPError
// @Router /api/item/{id} [get]
func GetItem(c *fiber.Ctx) error {
	// Create new Item and returns it
	return c.JSON(Item{
		Id: c.Params("id"),
	})
}

type Item struct {
	Id string
}

type HTTPError struct {
	Status  string
	Message string
}
