package main

import (
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/handler"

	"github.com/can-z/pickup/server/gql"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	schema := gql.Schema()

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   false,
		GraphiQL: true,
	})

	r.POST("/graphql", func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	})
	return r
}

func main() {
	r := setupRouter()
	_ = r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
