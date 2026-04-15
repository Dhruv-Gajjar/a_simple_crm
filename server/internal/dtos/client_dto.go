package dtos

import (
	"founder-diary/internal/models"

	"github.com/google/uuid"
)

type ClientDto struct {
	ID     uuid.UUID
	Name   string
	Email  string
	About  string
	Status models.ClientStatus
	Phone  string
}

type CreateClientDto struct {
	Name   string
	Email  string
	About  string
	Status models.ClientStatus
	Phone  string
}
